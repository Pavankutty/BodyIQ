def calculate_protein_target(
    weight_kg: float,
    goal: str
) -> float:

    normalized_goal = goal.lower().strip()

    protein_multipliers = {
        "weight loss": 1.6,
        "fat loss": 1.6,
        "maintenance": 1.4,
        "muscle gain": 1.8,
        "weight gain": 1.8
    }

    if normalized_goal not in protein_multipliers:
        raise ValueError(
            "Invalid goal. "
            "Use: Weight Loss, Fat Loss, Maintenance, "
            "Muscle Gain, or Weight Gain"
        )

    protein = weight_kg * protein_multipliers[normalized_goal]

    return round(protein, 2)


def calculate_fat_target(
    calorie_target: float
) -> float:

    # Approximately 25% of daily calories from fat
    fat_calories = calorie_target * 0.25

    # 1 gram of fat = 9 calories
    fat_grams = fat_calories / 9

    return round(fat_grams, 2)


def calculate_carb_target(
    calorie_target: float,
    protein_grams: float,
    fat_grams: float
) -> float:

    protein_calories = protein_grams * 4
    fat_calories = fat_grams * 9

    remaining_calories = (
        calorie_target
        - protein_calories
        - fat_calories
    )

    # 1 gram of carbohydrate = 4 calories
    carb_grams = remaining_calories / 4

    return round(carb_grams, 2)


def calculate_macros(
    weight_kg: float,
    calorie_target: float,
    goal: str
) -> dict:

    protein = calculate_protein_target(
        weight_kg,
        goal
    )

    fat = calculate_fat_target(
        calorie_target
    )

    carbs = calculate_carb_target(
        calorie_target,
        protein,
        fat
    )

    return {
        "protein_g": protein,
        "carbohydrates_g": carbs,
        "fat_g": fat
    }