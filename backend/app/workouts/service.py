def get_workout_plan(
    goal: str,
    fitness_level: str,
    activity_level: str
) -> dict:

    normalized_goal = goal.lower().strip()
    normalized_level = fitness_level.lower().strip()
    normalized_activity = activity_level.lower().strip()

    if normalized_level not in [
        "beginner",
        "intermediate",
        "advanced"
    ]:
        raise ValueError(
            "Invalid fitness level. "
            "Use: Beginner, Intermediate, or Advanced"
        )

    # -------------------------
    # MUSCLE GAIN
    # -------------------------

    if normalized_goal in ["muscle gain", "weight gain"]:

        if normalized_level == "beginner":

            sessions = [
                {
                    "day": 1,
                    "focus": "Full Body",
                    "exercises": [
                        "Bodyweight Squats",
                        "Push-ups",
                        "Lat Pulldown",
                        "Dumbbell Shoulder Press"
                    ]
                },
                {
                    "day": 2,
                    "focus": "Rest / Recovery",
                    "exercises": []
                },
                {
                    "day": 3,
                    "focus": "Full Body",
                    "exercises": [
                        "Goblet Squats",
                        "Dumbbell Bench Press",
                        "Seated Cable Row",
                        "Dumbbell Curl"
                    ]
                },
                {
                    "day": 4,
                    "focus": "Rest / Recovery",
                    "exercises": []
                },
                {
                    "day": 5,
                    "focus": "Full Body",
                    "exercises": [
                        "Leg Press",
                        "Incline Dumbbell Press",
                        "Lat Pulldown",
                        "Triceps Pushdown"
                    ]
                }
            ]

            days_per_week = 3

        elif normalized_level == "intermediate":

            sessions = [
                {
                    "day": 1,
                    "focus": "Chest & Triceps",
                    "exercises": [
                        "Bench Press",
                        "Incline Dumbbell Press",
                        "Cable Fly",
                        "Triceps Pushdown"
                    ]
                },
                {
                    "day": 2,
                    "focus": "Back & Biceps",
                    "exercises": [
                        "Lat Pulldown",
                        "Seated Cable Row",
                        "Barbell Row",
                        "Dumbbell Curl"
                    ]
                },
                {
                    "day": 3,
                    "focus": "Legs",
                    "exercises": [
                        "Squats",
                        "Leg Press",
                        "Leg Curl",
                        "Calf Raises"
                    ]
                },
                {
                    "day": 4,
                    "focus": "Shoulders & Core",
                    "exercises": [
                        "Overhead Press",
                        "Lateral Raises",
                        "Face Pulls",
                        "Plank"
                    ]
                },
                {
                    "day": 5,
                    "focus": "Full Body",
                    "exercises": [
                        "Deadlift",
                        "Dumbbell Press",
                        "Pull-ups",
                        "Lunges"
                    ]
                }
            ]

            days_per_week = 5

        else:

            sessions = [
                {
                    "day": 1,
                    "focus": "Push",
                    "exercises": [
                        "Barbell Bench Press",
                        "Incline Bench Press",
                        "Overhead Press",
                        "Weighted Dips"
                    ]
                },
                {
                    "day": 2,
                    "focus": "Pull",
                    "exercises": [
                        "Deadlift",
                        "Weighted Pull-ups",
                        "Barbell Row",
                        "Face Pulls"
                    ]
                },
                {
                    "day": 3,
                    "focus": "Legs",
                    "exercises": [
                        "Barbell Squats",
                        "Romanian Deadlift",
                        "Leg Press",
                        "Calf Raises"
                    ]
                },
                {
                    "day": 4,
                    "focus": "Push",
                    "exercises": [
                        "Incline Dumbbell Press",
                        "Shoulder Press",
                        "Cable Fly",
                        "Triceps Extension"
                    ]
                },
                {
                    "day": 5,
                    "focus": "Pull",
                    "exercises": [
                        "Weighted Chin-ups",
                        "T-Bar Row",
                        "Lat Pulldown",
                        "Barbell Curl"
                    ]
                },
                {
                    "day": 6,
                    "focus": "Legs & Core",
                    "exercises": [
                        "Front Squats",
                        "Bulgarian Split Squats",
                        "Hamstring Curl",
                        "Hanging Leg Raises"
                    ]
                }
            ]

            days_per_week = 6

    # -------------------------
    # FAT LOSS
    # -------------------------

    elif normalized_goal in ["weight loss", "fat loss"]:

        if normalized_level == "beginner":

            sessions = [
                {
                    "day": 1,
                    "focus": "Full Body + Cardio",
                    "exercises": [
                        "Bodyweight Squats",
                        "Wall Push-ups",
                        "Lat Pulldown",
                        "15 min Walking"
                    ]
                },
                {
                    "day": 2,
                    "focus": "Rest / Recovery",
                    "exercises": []
                },
                {
                    "day": 3,
                    "focus": "Full Body + Cardio",
                    "exercises": [
                        "Leg Press",
                        "Seated Row",
                        "Dumbbell Press",
                        "15 min Cycling"
                    ]
                },
                {
                    "day": 4,
                    "focus": "Rest / Recovery",
                    "exercises": []
                },
                {
                    "day": 5,
                    "focus": "Full Body + Cardio",
                    "exercises": [
                        "Lunges",
                        "Push-ups",
                        "Lat Pulldown",
                        "20 min Walking"
                    ]
                }
            ]

            days_per_week = 3

        elif normalized_level == "intermediate":

            sessions = [
                {
                    "day": 1,
                    "focus": "Upper Body + Cardio",
                    "exercises": [
                        "Bench Press",
                        "Lat Pulldown",
                        "Shoulder Press",
                        "20 min Cardio"
                    ]
                },
                {
                    "day": 2,
                    "focus": "Lower Body",
                    "exercises": [
                        "Squats",
                        "Leg Press",
                        "Leg Curl",
                        "15 min Cardio"
                    ]
                },
                {
                    "day": 3,
                    "focus": "Core + Cardio",
                    "exercises": [
                        "Plank",
                        "Leg Raises",
                        "Mountain Climbers",
                        "25 min Cardio"
                    ]
                },
                {
                    "day": 4,
                    "focus": "Upper Body",
                    "exercises": [
                        "Incline Press",
                        "Seated Row",
                        "Lateral Raises",
                        "20 min Cardio"
                    ]
                },
                {
                    "day": 5,
                    "focus": "Lower Body + Cardio",
                    "exercises": [
                        "Lunges",
                        "Leg Press",
                        "Leg Curl",
                        "25 min Cardio"
                    ]
                }
            ]

            days_per_week = 5

        else:

            sessions = [
                {
                    "day": 1,
                    "focus": "Push + Cardio",
                    "exercises": [
                        "Bench Press",
                        "Overhead Press",
                        "Weighted Dips",
                        "30 min Cardio"
                    ]
                },
                {
                    "day": 2,
                    "focus": "Pull + Cardio",
                    "exercises": [
                        "Deadlift",
                        "Pull-ups",
                        "Barbell Row",
                        "30 min Cardio"
                    ]
                },
                {
                    "day": 3,
                    "focus": "Legs",
                    "exercises": [
                        "Squats",
                        "Romanian Deadlift",
                        "Leg Press",
                        "20 min Cardio"
                    ]
                },
                {
                    "day": 4,
                    "focus": "Upper Body + Cardio",
                    "exercises": [
                        "Incline Press",
                        "Cable Row",
                        "Shoulder Press",
                        "30 min Cardio"
                    ]
                },
                {
                    "day": 5,
                    "focus": "Lower Body",
                    "exercises": [
                        "Front Squats",
                        "Lunges",
                        "Hamstring Curl",
                        "25 min Cardio"
                    ]
                },
                {
                    "day": 6,
                    "focus": "Conditioning",
                    "exercises": [
                        "Kettlebell Swings",
                        "Burpees",
                        "Mountain Climbers",
                        "30 min Cardio"
                    ]
                }
            ]

            days_per_week = 6

    # -------------------------
    # GENERAL FITNESS
    # -------------------------

    else:

        if normalized_level == "beginner":

            sessions = [
                {
                    "day": 1,
                    "focus": "Full Body",
                    "exercises": [
                        "Bodyweight Squats",
                        "Push-ups",
                        "Lat Pulldown",
                        "Walking"
                    ]
                },
                {
                    "day": 2,
                    "focus": "Rest / Recovery",
                    "exercises": []
                },
                {
                    "day": 3,
                    "focus": "Full Body",
                    "exercises": [
                        "Leg Press",
                        "Seated Row",
                        "Dumbbell Press",
                        "Cycling"
                    ]
                },
                {
                    "day": 4,
                    "focus": "Rest / Recovery",
                    "exercises": []
                },
                {
                    "day": 5,
                    "focus": "Full Body",
                    "exercises": [
                        "Lunges",
                        "Shoulder Press",
                        "Lat Pulldown",
                        "Walking"
                    ]
                }
            ]

            days_per_week = 3

        else:

            sessions = [
                {
                    "day": 1,
                    "focus": "Upper Body",
                    "exercises": [
                        "Bench Press",
                        "Lat Pulldown",
                        "Shoulder Press",
                        "Dumbbell Curl"
                    ]
                },
                {
                    "day": 2,
                    "focus": "Lower Body",
                    "exercises": [
                        "Squats",
                        "Leg Press",
                        "Leg Curl",
                        "Calf Raises"
                    ]
                },
                {
                    "day": 3,
                    "focus": "Cardio & Core",
                    "exercises": [
                        "Walking",
                        "Cycling",
                        "Plank",
                        "Leg Raises"
                    ]
                },
                {
                    "day": 4,
                    "focus": "Full Body",
                    "exercises": [
                        "Squats",
                        "Push-ups",
                        "Rows",
                        "Lunges"
                    ]
                }
            ]

            days_per_week = 4

    return {
        "plan_name": normalized_goal.title(),
        "fitness_level": normalized_level.title(),
        "activity_level": normalized_activity.title(),
        "days_per_week": days_per_week,
        "sessions": sessions
    }