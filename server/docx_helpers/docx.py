import os
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE



def generate_report_file(data: dict) -> dict:
    # Создаем документ
    document = Document()
    ticket_data = data['ticketData']

    # Добавляем заголовок
    # ticket_heading = document.add_heading('Заявка системному администратору', level=0)

    # ticket_title = document.add_paragraph('').add_run("Заявка системному администратору").bold = True

    # Добавляем абзац с текстом "Заявка системному администратору"
    ticket_title = document.add_paragraph("Заявка системному администратору")

    # Делаем текст в абзаце жирным
    for run in ticket_title.runs:
        run.bold = True

    # Устанавливаем выравнивание текста в центр
    paragraph_format = ticket_title.paragraph_format
    paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER

    # Добавляем информацию о тикете
    document.add_paragraph(f"Заголовок проблемы: ").add_run(ticket_data['problem_title']).bold = True
    document.add_paragraph(f"Номер аудитории: {ticket_data['room_number']}")

    if (ticket_data['problem_description']):
        document.add_paragraph(f"Описание проблемы: {ticket_data['problem_description']}")
        
    document.add_paragraph(f"Дата регистрации заявки: {ticket_data['submission_date']}")
    document.add_paragraph(f"Выполнить работу до: {ticket_data['deadline_date']}")
    document.add_paragraph(f"ФИО заказчика: ").add_run(ticket_data['customer_name']).bold = True
    document.add_paragraph(f"ФИО исполнителя: ").add_run(ticket_data['performer_name']).bold = True
    
    # Добавляем информацию о задачах
    document.add_heading('Задачи', level=1)
    table = document.add_table(rows=1, cols=2)

    # Заголовки столбцов
    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = 'Компьютер'
    hdr_cells[0].paragraphs[0].runs[0].bold = True  # Делаем текст жирным
    hdr_cells[1].text = 'Описание задачи'
    hdr_cells[1].paragraphs[0].runs[0].bold = True  # Делаем текст жирным

    # for task in ticket_data['tasks']:
    #     document.add_paragraph(f"Компьютер: {task['pc_name']}")
    #     document.add_paragraph(f"Описание: {task['task_description']}")
    
    for task in ticket_data['tasks']:
        row_cells = table.add_row().cells
        row_cells[0].text = task['pc_name']
        row_cells[1].text = task['task_description']

    # Создаем имя файла на основе ticket_id
    report_filename = f"report_{ticket_data['ticket_id']}.docx"

    # Сохраняем документ
    document.save(os.path.join("reports", report_filename))

    return {"filename": report_filename}

def get_report_file_path(filename: str) -> str | bool:
    report_path = os.path.join("reports", filename)

    if not os.path.exists(report_path):
        return False

    return report_path