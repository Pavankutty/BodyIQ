from fastapi import APIRouter, Depends

from app.models.user import User
from app.core.dependencies import get_current_user
from app.calculations.fitness import calculate_fitness_metrics
from app.workouts.service import get_workout_plan
from app.nutrition.calculator import calculate_macros
from app.nutrition.diet import get_diet_plan

router = APIRouter(
    prefix="/fitness",
    tags=["Fitness"]
)


@router.get("/metrics")
def get_fitness_metrics(
    current_user: User = Depends(get_current_user)
):
    metrics = calculate_fitness_metrics(
        weight_kg=current_user.weight_kg,
        height_cm=current_user.height_cm,
        age=current_user.age,
        gender=current_user.gender,
        activity_level=current_user.activity_level,
        goal=current_user.goal
    )

    return metrics
@router.get("/workout")
def get_workout(
    current_user: User = Depends(get_current_user)
):
    workout_plan = get_workout_plan(
        goal=current_user.goal,
        fitness_level=current_user.fitness_level,
        activity_level=current_user.activity_level
    )

    return workout_plan

@router.get("/nutrition")
def get_nutrition(
    current_user: User = Depends(get_current_user)
):
    metrics = calculate_fitness_metrics(
        weight_kg=current_user.weight_kg,
        height_cm=current_user.height_cm,
        age=current_user.age,
        gender=current_user.gender,
        activity_level=current_user.activity_level,
        goal=current_user.goal
    )

    macros = calculate_macros(
        weight_kg=current_user.weight_kg,
        calorie_target=metrics["calorie_target"],
        goal=current_user.goal
    )

    return {
        "calorie_target": metrics["calorie_target"],
        "protein_g": macros["protein_g"],
        "carbohydrates_g": macros["carbohydrates_g"],
        "fat_g": macros["fat_g"]
    }

@router.get("/diet")
def get_diet(
    current_user: User = Depends(get_current_user)
):
    metrics = calculate_fitness_metrics(
        weight_kg=current_user.weight_kg,
        height_cm=current_user.height_cm,
        age=current_user.age,
        gender=current_user.gender,
        activity_level=current_user.activity_level,
        goal=current_user.goal
    )

    macros = calculate_macros(
        weight_kg=current_user.weight_kg,
        calorie_target=metrics["calorie_target"],
        goal=current_user.goal
    )

    diet_plan = get_diet_plan(
        goal=current_user.goal,
        diet_type=current_user.diet_type,
        calorie_target=metrics["calorie_target"],
        protein_target=macros["protein_g"]
    )

    return diet_plan