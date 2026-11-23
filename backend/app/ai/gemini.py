
import time
from google import genai
from google.genai import types, errors

from app.core.config import settings

from app.ai.tools import (
    get_user_fitness_data,
    get_user_workout,
    get_user_diet,
)


# --------------------------------------------------
# GEMINI CLIENT CONFIGURATION
# --------------------------------------------------

MODEL_NAME = "gemini-3.5-flash-lite"

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


# --------------------------------------------------
# BODYIQ AI SYSTEM INSTRUCTIONS
# --------------------------------------------------

SYSTEM_INSTRUCTION = """
You are BodyIQ AI, a friendly and knowledgeable fitness coach.

Your responsibilities:
- Help users with fitness, workouts, nutrition, and healthy habits.
- Give practical and easy-to-follow fitness advice.
- Use the user's actual profile and fitness data when available.
- Never invent personal fitness information.
- Never assume the user's weight, height, age, or diet preference.
- Explain fitness calculations in simple language.
- Keep answers clear, supportive, and concise.

IMPORTANT TOOL RULES:

1. Use get_user_fitness_data when the user asks about:
   BMI, BMR, TDEE, calorie targets, protein targets,
   carbohydrates, or fat targets.

2. Use get_user_workout when the user asks about:
   their workout plan, exercises, training routine,
   or today's workout.

3. Use get_user_diet when the user asks about:
   their diet plan, meals, vegetarian food,
   non-vegetarian food, or nutrition suggestions.

4. Tool results belong to the authenticated user.
   Never use another user's information.

5. After receiving tool results, provide a proper
   natural-language answer to the user.

6. Do not return an empty response.

7. Do not repeatedly call the same tool when its
   result already contains the requested information.

8. If the tool returns an error, explain that the
   requested information could not be retrieved.
"""


# --------------------------------------------------
# BODYIQ FUNCTION DECLARATIONS
# --------------------------------------------------

bodyiq_tool = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="get_user_fitness_data",
            description=(
                "Retrieve the authenticated user's actual fitness metrics, "
                "including BMI, BMR, TDEE, calorie target, protein, "
                "carbohydrates, and fat targets."
            ),
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={}
            ),
        ),

        types.FunctionDeclaration(
            name="get_user_workout",
            description=(
                "Retrieve the authenticated user's workout plan based "
                "on their fitness goal, fitness level, and activity level."
            ),
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={}
            ),
        ),

        types.FunctionDeclaration(
            name="get_user_diet",
            description=(
                "Retrieve the authenticated user's personalized diet plan "
                "based on their goal, diet preference, calorie target, "
                "and protein target."
            ),
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={}
            ),
        ),
    ]
)


# --------------------------------------------------
# BASIC GEMINI CHAT
# --------------------------------------------------

def ask_gemini(message: str) -> str:

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=message,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION
            )
        )

        if response.text:
            return response.text.strip()

        return "I'm sorry, I couldn't generate a response. Please try again."

    except Exception as e:
        print("GEMINI CHAT ERROR:", repr(e))
        raise


# --------------------------------------------------
# FITNESS TOOL EXECUTION
# --------------------------------------------------

def execute_fitness_tool(
    tool_name: str,
    current_user
):

    if tool_name == "get_user_fitness_data":
        return get_user_fitness_data(current_user)

    elif tool_name == "get_user_workout":
        return get_user_workout(current_user)

    elif tool_name == "get_user_diet":
        return get_user_diet(current_user)

    else:
        raise ValueError(
            f"Unknown BodyIQ tool: {tool_name}"
        )


# --------------------------------------------------
# GEMINI API RETRY HANDLER
# --------------------------------------------------

def generate_response(contents, config):

    max_retries = 3

    for attempt in range(max_retries):

        try:
            return client.models.generate_content(
                model=MODEL_NAME,
                contents=contents,
                config=config
            )

        except errors.ServerError as e:

            error_message = str(e)

            if "503" in error_message or "UNAVAILABLE" in error_message:

                if attempt < max_retries - 1:
                    wait_time = 2 ** (attempt + 1)

                    print(
                        f"Gemini temporarily unavailable. "
                        f"Retrying in {wait_time} seconds..."
                    )

                    time.sleep(wait_time)
                    continue

            raise

    raise RuntimeError(
        "Gemini could not generate a response after retries."
    )


# --------------------------------------------------
# GEMINI CHAT WITH BODYIQ FITNESS TOOLS
# --------------------------------------------------

def ask_gemini_with_tools(
    message: str,
    current_user
) -> str:

    try:

        # Gemini configuration with BodyIQ tools
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            tools=[bodyiq_tool]
        )

        # Initial user message
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=message)
                ]
            )
        ]

        # Allow multiple tool-calling rounds
        max_tool_rounds = 5

        for round_number in range(max_tool_rounds):

            response = generate_response(
                contents=contents,
                config=config
            )

            if not response.candidates:
                raise RuntimeError(
                    "Gemini returned no response candidates."
                )

            candidate_content = response.candidates[0].content

            if not candidate_content:
                raise RuntimeError(
                    "Gemini returned empty response content."
                )

            # Extract function calls
            function_calls = response.function_calls or []

            # ------------------------------------------
            # NO MORE TOOL CALLS: RETURN FINAL ANSWER
            # ------------------------------------------

            if not function_calls:

                answer_parts = []

                for part in candidate_content.parts or []:

                    if part.text:
                        answer_parts.append(part.text)

                final_answer = "\n".join(answer_parts).strip()

                if final_answer:
                    return final_answer

                raise RuntimeError(
                    "Gemini returned an empty text response."
                )

            # ------------------------------------------
            # EXECUTE REQUESTED BODYIQ TOOLS
            # ------------------------------------------

            print(
                f"BodyIQ AI tool round: {round_number + 1}"
            )

            # Preserve Gemini's function-call message
            contents.append(candidate_content)

            tool_response_parts = []

            for function_call in function_calls:

                tool_name = function_call.name

                print(
                    f"Executing BodyIQ tool: {tool_name}"
                )

                try:

                    # Execute using the authenticated user
                    tool_result = execute_fitness_tool(
                        tool_name=tool_name,
                        current_user=current_user
                    )

                    tool_response = {
                        "success": True,
                        "data": tool_result
                    }

                except Exception as tool_error:

                    print(
                        f"BODYIQ TOOL ERROR ({tool_name}):",
                        repr(tool_error)
                    )

                    tool_response = {
                        "success": False,
                        "error": str(tool_error)
                    }

                # Create function response for Gemini
                tool_response_parts.append(
                    types.Part.from_function_response(
                        name=tool_name,
                        response=tool_response
                    )
                )

            # ------------------------------------------
            # SEND TOOL RESULTS BACK TO GEMINI
            # ------------------------------------------

            contents.append(
                types.Content(
                    role="user",
                    parts=tool_response_parts
                )
            )

        # ----------------------------------------------
        # MAXIMUM TOOL ROUNDS REACHED
        # ----------------------------------------------

        raise RuntimeError(
            "BodyIQ AI reached the maximum number of tool calls."
        )

    except errors.ClientError as e:

        print("GEMINI CLIENT ERROR:", repr(e))
        raise

    except errors.ServerError as e:

        print("GEMINI SERVER ERROR:", repr(e))
        raise

    except Exception as e:

        print("BODYIQ AI ERROR:", repr(e))
        raise
