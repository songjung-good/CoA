from abc import ABCMeta, abstractmethod
from typing import TypeVar, Generic

from fastapi import BackgroundTasks

from api.models.dto import AnalysisRequest

R = TypeVar('R', bound=AnalysisRequest, covariant=True)


class AnalysisService(Generic[R], metaclass=ABCMeta):   # class AnalysisService<R extends AnalysisRequest> { ... }
    def start_analysis(self, background_tasks: BackgroundTasks, request: R) -> bool:
        background_tasks.add_task(self.analyze, request)
        return True

    @abstractmethod
    async def analyze(self, request: R) -> None:
        pass
