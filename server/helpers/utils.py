

def reverse_date(date: str) -> str:
    parts = date.split(".")

    # Проверяем, что входная строка содержит три части (день, месяц, год)
    if len(parts) != 3:
        raise ValueError('Input date should be in the format "dd.mm.yyyy"')

    # Переставляем части местами и объединяем их в новую строку
    reversed_date = f"{parts[2]}.{parts[1]}.{parts[0]}"

    return reversed_date

def serialize_sqlalchemy_obj(obj):
    if hasattr(obj, '__dict__'):
        # Исключаем служебные атрибуты SQLAlchemy
        return {key: value for key, value in obj.__dict__.items() if not key.startswith('_')}
    return obj