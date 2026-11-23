def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    height_m = height_cm / 100

    if height_m <= 0:
        raise ValueError("Height must be greater than zero")

    bmi = weight_kg / (height_m ** 2)

    return round(bmi, 2)


def calculate_bmr(
    weight_kg: float,
    height_cm: float,
    age: int,
    gender: str
) -> float:

    gender = gender.lower()

    if gender == "male":
        bmr = (
            10 * weight_kg
            + 6.25 * height_cm
            - 5 * age
            + 5
        )

    elif gender == "female":
        bmr = (
            10 * weight_kg
            + 6.25 * height_cm
            - 5 * age
            - 161
        )

    else:
        raise ValueError("Gender must be Male or Female")

    return round(bmr, 2)

def calculate_tdee(
    bmr: float,
    activity_level: str
) -> float:

    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very active": 1.9
    }

    level = activity_level.lower().strip()

    if level not in activity_multipliers:
        raise ValueError(
            "Invalid activity level. "
            "Use: Sedentary, Light, Moderate, Active, or Very Active"
        )

    tdee = bmr * activity_multipliers[level]

    return round(tdee, 2)

def calculate_calorie_target(
    tdee: float,
    goal: str
) -> float:

    goal_adjustments = {
        "weight loss": -500,
        "fat loss": -500,
        "maintenance": 0,
        "muscle gain": 300,
        "weight gain": 300
    }

    normalized_goal = goal.lower().strip()

    if normalized_goal not in goal_adjustments:
        raise ValueError(
            "Invalid goal. "
            "Use: Weight Loss, Fat Loss, Maintenance, "
            "Muscle Gain, or Weight Gain"
        )

    calorie_target = tdee + goal_adjustments[normalized_goal]

    return round(calorie_target, 2)

def calculate_fitness_metrics(
    weight_kg: float,
    height_cm: float,
    age: int,
    gender: str,
    activity_level: str,
    goal: str
) -> dict:

    bmi = calculate_bmi(
        weight_kg,
        height_cm
    )

    bmr = calculate_bmr(
        weight_kg,
        height_cm,
        age,
        gender
    )

    tdee = calculate_tdee(
        bmr,
        activity_level
    )

    calorie_target = calculate_calorie_target(
        tdee,
        goal
    )

    return {
        "bmi": bmi,
        "bmr": bmr,
        "tdee": tdee,
        "calorie_target": calorie_target
    }