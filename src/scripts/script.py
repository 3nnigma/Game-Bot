from PIL import Image

# Функция для склеивания изображений
def combine_images(image_paths, output_path):
    # Загрузка всех изображений
    images = [Image.open(image) for image in image_paths]

    # Предполагаем, что все изображения имеют одинаковый размер
    image_width, image_height = images[0].size

    # Настраиваем размер результирующего изображения
    total_width = image_width * 3
    total_height = image_height * 3

    # Создание нового изображения с белым фоном
    new_image = Image.new('RGB', (total_width, total_height), (255, 255, 255))

    # Вставка изображений в новом порядке
    for i, img in enumerate(images):
        row = i // 3
        col = i % 3
        x_offset = col * image_width
        y_offset = row * image_height
        new_image.paste(img, (x_offset, y_offset))

    # Сохранение результирующего изображения
    new_image.save(output_path)

# Пути к изображениям в обратном порядке
image_paths = [
    # "../Bot/auth/captcha/map_000011.png",
    # "../Bot/auth/captcha/map_000010.png",
    # "../Bot/auth/captcha/map_000009.png",
    "../Bot/auth/captcha/map_000008.png",
    "../Bot/auth/captcha/map_000007.png",
    "../Bot/auth/captcha/map_000006.png",
    "../Bot/auth/captcha/map_000005.png",
    "../Bot/auth/captcha/map_000004.png",
    "../Bot/auth/captcha/map_000003.png",
    "../Bot/auth/captcha/map_000002.png",
    "../Bot/auth/captcha/map_000001.png",
    "../Bot/auth/captcha/map_000000.png",
]

# Путь к результирующему изображению
output_path = "../Bot/auth/CAPTCHA_IMAGE.png"

# Вызов функции для склеивания изображений
combine_images(image_paths, output_path)


