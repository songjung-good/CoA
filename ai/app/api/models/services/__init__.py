from typing import TypeVar, Generic

from api.models.dto import AnalysisRequest

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class AnalysisService(Generic[R]):   # Java: `class AnalysisService<R extends AnalysisRequest> { ... }`
    pass