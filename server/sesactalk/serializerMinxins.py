def get_campus_name(user_instance):
    if user_instance.second_course:
        return user_instance.second_course.campus.name
    return user_instance.first_course.campus.nam