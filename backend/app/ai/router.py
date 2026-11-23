from fastapi import APIRouter, Depends, HTTPException, status
from google.genai import errors

from app.core.dependencies import get_current_user
from app.models.user import User

from app.calculations.fitness import calculate_fitness_metrics
from app.nutrition.calculator import calculate_macros
from app.workouts.service import get_workout_plan
from app.nutrition.diet import get_diet_plan

from app.ai.gemini import (
    ask_gemini,
    ask_gemini_with_tools
)

from app.ai.tools import (
    get_user_fitness_data,
    get_user_workout,
    get_user_diet
)


from app.schemas.ai import AIChatRequest, AIChatResponse


router = APIRouter(prefix="/ai", tags=["AI"])


# =========================================================
# LEGACY AI CHAT
# =========================================================

@router.post("/chat-legacy", response_model=AIChatResponse)
def ai_chat_legacy(
    request: AIChatRequest,
    current_user: User = Depends(get_current_user)
):
    # Get BodyIQ trusted data
    fitness_data = get_user_fitness_data(current_user)
    workout_data = get_user_workout(current_user)
    diet_data = get_user_diet(current_user)

    # Calculate BodyIQ fitness metrics
    metrics = calculate_fitness_metrics(
        weight_kg=current_user.weight_kg,
        height_cm=current_user.height_cm,
        age=current_user.age,
        gender=current_user.gender,
        activity_level=current_user.activity_level,
        goal=current_user.goal
    )

    # Calculate nutrition targets
    macros = calculate_macros(
        weight_kg=current_user.weight_kg,
        calorie_target=metrics["calorie_target"],
        goal=current_user.goal
    )

    # Get workout plan
    workout_plan = get_workout_plan(
        goal=current_user.goal,
        fitness_level=current_user.fitness_level,
        activity_level=current_user.activity_level
    )

    # Get diet plan
    diet_plan = get_diet_plan(
        goal=current_user.goal,
        diet_type=current_user.diet_type,
        calorie_target=metrics["calorie_target"],
        protein_target=macros["protein_g"]
    )

    # Give Gemini the user's BodyIQ context
    prompt = f"""
You are BodyIQ AI, a personalized fitness and nutrition assistant.

You are helping the following BodyIQ user:

Name: {current_user.name}
Age: {current_user.age}
Gender: {current_user.gender}
Height: {current_user.height_cm} cm
Weight: {current_user.weight_kg} kg

Goal: {current_user.goal}
Activity Level: {current_user.activity_level}
Fitness Level: {current_user.fitness_level}
Diet Type: {current_user.diet_type}

BodyIQ calculated metrics:
BMI: {metrics["bmi"]}
BMR: {metrics["bmr"]}
TDEE: {metrics["tdee"]}
Daily Calorie Target: {metrics["calorie_target"]} kcal

Daily Nutrition Targets:
Protein: {macros["protein_g"]} g
Carbohydrates: {macros["carbohydrates_g"]} g
Fat: {macros["fat_g"]} g

Workout Plan:
{workout_plan}

Diet Plan:
{diet_plan}

Instructions:
- Give practical and personalized fitness/nutrition guidance.
- Respect the user's diet type.
- Consider the user's goal, fitness level and activity level.
- Keep answers clear and easy to understand.
- Do not invent BodyIQ metrics.
- Do not change calculated calorie or macro values unless explaining why a different target may be appropriate.
- For medical problems, injuries, eating disorders, or serious symptoms, recommend consulting a qualified healthcare professional.
- You are an AI fitness assistant, not a doctor.

Trusted BodyIQ Fitness Data:
{fitness_data}

Important:
- These numbers are calculated by BodyIQ.
- Treat these values as the source of truth.
- Do not recalculate or replace them with your own estimates.
- When the user asks about calories, macros, BMI, BMR, or TDEE, use these values.

Trusted BodyIQ Workout Plan:
{workout_data}

Important:
- This workout plan comes directly from BodyIQ.
- Treat it as the source of truth when answering workout questions.
- Do not replace it with a completely different workout unless the user specifically asks for an alternative.

Trusted BodyIQ Diet Plan:
{diet_data}

Important:
- This diet plan comes directly from BodyIQ.
- Respect the user's stored diet type.
- Use this plan as the source of truth when answering diet and meal questions.
- Do not change the user's calorie or protein targets.
- You may explain the meals or suggest substitutions when requested.

User's question:
{request.message}
"""

    try:
        answer = ask_gemini(prompt)

        return AIChatResponse(
            response=answer
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="BodyIQ AI is temporarily unavailable. Please try again in a moment."
        )


# =========================================================
# MAIN BODYIQ AI CHAT
# =========================================================

@router.post("/chat", response_model=AIChatResponse)
def ai_chat(
    request: AIChatRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        answer = ask_gemini_with_tools(
            message=request.message,
            current_user=current_user
        )

        return AIChatResponse(
            response=answer
        )

    except errors.ClientError as e:
        print("GEMINI CLIENT ERROR:", e)

        if e.code == 429:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="BodyIQ AI usage limit has been reached. Please try again later."
            )

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="BodyIQ AI is temporarily unavailable. Please try again."
        )

    except errors.ServerError as e:
        import traceback

        print("\n========== GEMINI SERVER ERROR ==========")
        print(repr(e))
        traceback.print_exc()
        print("=========================================\n")

        raise HTTPException(
            status_code=503,
            detail=f"Gemini service error: {str(e)}"
        )

    except Exception as e:
        print("AI ERROR:", e)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred in BodyIQ AI."
        )