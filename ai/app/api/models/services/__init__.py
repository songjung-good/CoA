from typing import Generic, TypeVar, TypeAlias, NewType

from api.routers.analysis import AnalysisRequest

R: TypeAlias = NewType('R', AnalysisRequest)


class AnalysisService(Generic[R]):
    pass
