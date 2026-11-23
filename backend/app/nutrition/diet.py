def get_diet_plan(
    goal: str,
    diet_type: str,
    calorie_target: float,
    protein_target: float
) -> dict:

    normalized_goal = goal.lower().strip()
    normalized_diet = diet_type.lower().strip()

    if normalized_diet not in ["veg", "vegetarian", "non-veg", "non vegetarian"]:
        raise ValueError(
            "Invalid diet type. Use: Veg or Non-Veg"
        )

    is_veg = normalized_diet in ["veg", "vegetarian"]

    if normalized_goal in ["muscle gain", "weight gain"]:

        if is_veg:
            meals = [
                {
                    "meal": "Breakfast",
                    "foods": [
                        "Oats with milk",
                        "Banana",
                        "Almonds",
                        "Paneer"
                    ]
                },
                {
                    "meal": "Mid-Morning Snack",
                    "foods": [
                        "Greek yogurt",
                        "One fruit"
                    ]
                },
                {
                    "meal": "Lunch",
                    "foods": [
                        "Rice",
                        "Dal",
                        "Paneer",
                        "Vegetable curry",
                        "Curd"
                    ]
                },
                {
                    "meal": "Evening Snack",
                    "foods": [
                        "Peanut butter sandwich",
                        "Milk"
                    ]
                },
                {
                    "meal": "Dinner",
                    "foods": [
                        "Chapati",
                        "Paneer or tofu",
                        "Vegetable curry",
                        "Curd"
                    ]
                }
            ]

        else:
            meals = [
                {
                    "meal": "Breakfast",
                    "foods": [
                        "Oats with milk",
                        "Banana",
                        "Almonds",
                        "2 eggs"
                    ]
                },
                {
                    "meal": "Mid-Morning Snack",
                    "foods": [
                        "Greek yogurt",
                        "One fruit"
                    ]
                },
                {
                    "meal": "Lunch",
                    "foods": [
                        "Rice",
                        "Dal",
                        "Chicken",
                        "Vegetable curry",
                        "Curd"
                    ]
                },
                {
                    "meal": "Evening Snack",
                    "foods": [
                        "Peanut butter sandwich",
                        "Milk"
                    ]
                },
                {
                    "meal": "Dinner",
                    "foods": [
                        "Chapati",
                        "Chicken or fish",
                        "Vegetable curry",
                        "Curd"
                    ]
                }
            ]

    elif normalized_goal in ["weight loss", "fat loss"]:

        if is_veg:
            meals = [
                {
                    "meal": "Breakfast",
                    "foods": [
                        "Oats",
                        "Greek yogurt",
                        "One fruit"
                    ]
                },
                {
                    "meal": "Lunch",
                    "foods": [
                        "Brown rice",
                        "Dal",
                        "Paneer",
                        "Large serving of vegetables"
                    ]
                },
                {
                    "meal": "Snack",
                    "foods": [
                        "Fruit",
                        "Buttermilk"
                    ]
                },
                {
                    "meal": "Dinner",
                    "foods": [
                        "Chapati",
                        "Tofu or paneer",
                        "Vegetable salad"
                    ]
                }
            ]

        else:
            meals = [
                {
                    "meal": "Breakfast",
                    "foods": [
                        "Oats",
                        "2 eggs",
                        "One fruit"
                    ]
                },
                {
                    "meal": "Lunch",
                    "foods": [
                        "Rice",
                        "Dal",
                        "Grilled chicken",
                        "Large serving of vegetables"
                    ]
                },
                {
                    "meal": "Snack",
                    "foods": [
                        "Greek yogurt",
                        "One fruit"
                    ]
                },
                {
                    "meal": "Dinner",
                    "foods": [
                        "Chapati",
                        "Grilled chicken or fish",
                        "Vegetable salad"
                    ]
                }
            ]

    else:

        if is_veg:
            meals = [
                {
                    "meal": "Breakfast",
                    "foods": [
                        "Oats with milk",
                        "Fruit",
                        "Nuts"
                    ]
                },
                {
                    "meal": "Lunch",
                    "foods": [
                        "Rice",
                        "Dal",
                        "Paneer",
                        "Vegetables",
                        "Curd"
                    ]
                },
                {
                    "meal": "Snack",
                    "foods": [
                        "Fruit",
                        "Greek yogurt"
                    ]
                },
                {
                    "meal": "Dinner",
                    "foods": [
                        "Chapati",
                        "Paneer or tofu",
                        "Vegetables"
                    ]
                }
            ]

        else:
            meals = [
                {
                    "meal": "Breakfast",
                    "foods": [
                        "Oats with milk",
                        "2 eggs",
                        "Fruit"
                    ]
                },
                {
                    "meal": "Lunch",
                    "foods": [
                        "Rice",
                        "Dal",
                        "Chicken",
                        "Vegetables",
                        "Curd"
                    ]
                },
                {
                    "meal": "Snack",
                    "foods": [
                        "Greek yogurt",
                        "Fruit"
                    ]
                },
                {
                    "meal": "Dinner",
                    "foods": [
                        "Chapati",
                        "Chicken or fish",
                        "Vegetables"
                    ]
                }
            ]

    return {
        "goal": normalized_goal.title(),
        "diet_type": "Vegetarian" if is_veg else "Non-Vegetarian",
        "calorie_target": calorie_target,
        "protein_target_g": protein_target,
        "meals": meals
    }