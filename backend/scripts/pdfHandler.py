import sys
from PyPDF2 import PdfFileWriter, PdfFileReader


def main(timestamp, inputpdf, url_folder):
    for i in range(inputpdf.numPages):
        output = PdfFileWriter()
        output.addPage(inputpdf.getPage(i))
        file = None
        try:
            file = open(url_folder + "%s-%s.pdf" % (i, timestamp), "rb")
            continue
        except IOError:
            try:
                with open(url_folder + "%s-%s.pdf" % (i, timestamp), "wb") as outputStream:
                    output.write(outputStream)
            except Exception as e:
                continue
        finally:
            if(file != None):
                file.close()


if __name__ == '__main__':
    timestamp = sys.argv[1]
    fileurl = sys.argv[2]
    folderurl = sys.argv[3]
    inputpdf = PdfFileReader(open(fileurl, "rb"), strict=False)
    main(timestamp, inputpdf, folderurl)
