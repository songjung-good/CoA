from api.models.code import AnalysisStatus


class AnalysisException(Exception):
    def __init__(
            self,
            status: AnalysisStatus = AnalysisStatus.ERROR,
            msg: str = '분석 중 에러가 발생헀습니다.'
    ):
        self.status = status
        self.msg = msg
