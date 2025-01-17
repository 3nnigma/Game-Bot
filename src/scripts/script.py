from PIL import Image
import os

def combine_images(image_paths, grid_size, output_path):
    images = [Image.open(image) for image in image_paths]

    image_width, image_height = images[0].size

    rows, cols = grid_size
    total_width = image_width * cols
    total_height = image_height * rows

    new_image = Image.new('RGB', (total_width, total_height), (255, 255, 255))

    for i, img in enumerate(images):
        row = i // cols
        col = i % cols
        x_offset = col * image_width
        y_offset = row * image_height
        new_image.paste(img, (x_offset, y_offset))

    new_image.save(output_path)

input_folder = "..t/src/Bot/auth/captcha"
output_folder= "../src/Bot/auth/output"
os.makedirs(output_folder, exist_ok=True)

image_files = sorted(
    [os.path.join(input_folder, f) for f in os.listdir(input_folder) if f.endswith(('.png', '.jpg', '.jpeg'))]
)

if len(image_files) < 48:
    raise ValueError("Недостаточно изображений в папке. Требуется минимум 48.")

images_per_group = 12  
grid_size = (3, 4)

group_paths = []
for group_index in range(4):
    start_index = group_index * images_per_group
    end_index = start_index + images_per_group
    group_images = image_files[start_index:end_index]

    group_output_path = os.path.join(output_folder, f"group_{group_index + 1}.png")
    combine_images(group_images, grid_size, group_output_path)
    group_paths.append(group_output_path)

final_output_path = os.path.join(output_folder, "CAPTCHA_IMAGE.png")
combine_images(group_paths, (2, 2), final_output_path)

print(f"Финальное изображение сохранено по пути: {final_output_path}")
