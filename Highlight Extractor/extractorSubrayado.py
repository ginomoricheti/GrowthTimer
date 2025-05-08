import os
import fitz  # PyMuPDF
from docx import Document
from docx.shared import Pt

def extract_highlighted_text(pdf_path):
    '''Extract the highlighted text from the PDF as a .word file'''
    
    doc = fitz.open(pdf_path)
    highlighted_texts = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        annot = page.first_annot

        while annot:
            if annot.type[0] == 8:  # Highlight
                rect = annot.rect
                text = page.get_textbox(rect)
                if text.strip():
                    highlighted_texts.append(text.strip())
            annot = annot.next

    return highlighted_texts

def save_to_word(highlighted_texts, output_path):
    doc = Document()
    full_text = ' '.join(highlighted_texts)
    doc.add_paragraph(full_text)
    doc.save(output_path)
    return output_path

def reformat_word_doc(input_path, output_path):
    '''Reformat .word file removing blank spaces'''
    
    document = Document(input_path)
    new_doc = Document()

    # General Style
    style = new_doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(11)

    for para in document.paragraphs:
        text = para.text.strip()
        if text:
            new_doc.add_paragraph(text)

    new_doc.save(output_path)

# Main loop
while True:
    print("""
==========================================
  EXTRACTOR DEL TEXTO REMARCADO EN EL PDF
        por Gino Morichetti
                >.<
==========================================
""")
    try:
        import_route = input('Ingrese la ruta del archivo PDF (o 0 para salir): ').strip()
        if import_route == '0':
            print('Programa finalizado.')
            break

        file_route = os.path.join(import_route)

        highlighted = extract_highlighted_text(file_route)

        if highlighted:
            pdf_dir = os.path.dirname(file_route)
            temp_docx = os.path.join(pdf_dir, 'temporal_resaltado.docx')
            final_docx = os.path.join(pdf_dir, 'resaltado.docx')

            save_to_word(highlighted, temp_docx)
            reformat_word_doc(temp_docx, final_docx)

            os.remove(temp_docx)  # Remove temporal file
            print(f'Documento Word final guardado en: {final_docx}')

        else:
            print('No se encontraron textos resaltados en el PDF.')

    except FileNotFoundError:
        print(f'El archivo {import_route} no se ha encontrado. Por favor, asegúrese de que el archivo exista antes de ser leído.')
    except Exception as e:
        print(f'Ocurrió un error, la ruta ingresada no es correcta: {e}')
