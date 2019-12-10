import sys
from PyPDF2 import PdfFileWriter, PdfFileReader


def main(timestamp, inputpdf, url_folder):
    for i in range(inputpdf.numPages):
        output = PdfFileWriter()
        output.addPage(inputpdf.getPage(i))
        try:
            file = open(url_folder + "%s-%s.pdf" % (i, timestamp), "rb")
            continue
        except FileNotFoundError:
            try:
                with open(url_folder + "%s-%s.pdf" % (i, timestamp), "wb") as outputStream:
                    output.write(outputStream)
            except Exception as e:
                print(e)
        finally:
            file.close()


if __name__ == '__main__':
    timestamp = sys.argv[1]
    fileurl = sys.argv[2]
    folderurl = sys.argv[3]
    inputpdf = PdfFileReader(open(fileurl, "rb"))
    main(timestamp, inputpdf, folderurl)
