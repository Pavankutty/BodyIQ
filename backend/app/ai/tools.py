from app.calculations.fitness import calculate_fitness_metrics
from app.nutrition.calculator import calculate_macros


def get_user_fitness_data(user):
    metrics = calculate_fitness_metrics(
        weight_kg=user.weight_kg,
        height_cm=user.height_cm,
        age=user.age,
        gender=user.gender,
        activity_level=user.activity_level,
        goal=user.goal
    )

    macros = calculate_macros(
        weight_kg=user.weight_kg,
        calorie_target=metrics["calorie_target"],
        goal=user.goal
    )

    return {
        "bmi": metrics["bmi"],
        "bmr": metrics["bmr"],
        "tdee": metrics["tdee"],
        "calorie_target": metrics["calorie_target"],
        "protein_g": macros["protein_g"],
        "carbohydrates_g": macros["carbohydrates_g"],
        "fat_g": macros["fat_g"]
    }

def get_user_workout(user):
    from app.workouts.service import get_workout_plan

    return get_workout_plan(
        goal=user.goal,
        fitness_level=user.fitness_level,
        activity_level=user.activity_level
    )

def get_user_diet(user):
    from app.nutrition.diet import get_diet_plan

    metrics = calculate_fitness_metrics(
        weight_kg=user.weight_kg,
        height_cm=user.height_cm,
        age=user.age,
        gender=user.gender,
        activity_level=user.activity_level,
        goal=user.goal
    )

    macros = calculate_macros(
        weight_kg=user.weight_kg,
        calorie_target=metrics["calorie_target"],
        goal=user.goal
    )

    return get_diet_plan(
        goal=user.goal,
        diet_type=user.diet_type,
        calorie_target=metrics["calorie_target"],
        protein_target=macros["protein_g"]
    )

BODYIQ_TOOL_DEFINITIONS = [
    {
        "name": "get_user_fitness_data",
        "description": (
            "Get the authenticated user's BodyIQ fitness metrics and "
            "nutrition targets, including BMI, BMR, TDEE, daily calories, "
            "protein, carbohydrates, and fat."
        ),
    },
    {
        "name": "get_user_workout",
        "description": (
            "Get the authenticated user's BodyIQ workout plan based on "
            "their goal, fitness level, and activity level."
        ),
    },
    {
        "name": "get_user_diet",
        "description": (
            "Get the authenticated user's BodyIQ diet plan based on "
            "their goal, diet type, calorie target, and protein target."
        ),
    },
]