from datetime import datetime
import os


class ReportCleaner:
    def __init__(self, SessionLocal, path_to_reports_folder="reports"):
        self.session = SessionLocal()
        self.path_to_reports_folser = path_to_reports_folder

    def clean_old_reports(self):
        print(f"Reports cleaning started at {datetime.now()}")

        try: 
            for file in os.listdir(self.path_to_reports_folser):
                file_path = os.path.join(self.path_to_reports_folser, file)
                os.remove(file_path)

        except Exception as ex:
            print(f"An error occurred while cleaning old reports: {ex}")
            self.session.rollback()
            return 0
        finally:
            self.session.close()
            print(f"Reports cleaning ended at {datetime.now()}")