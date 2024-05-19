from langchain.chains.base import Chain
from langchain.chains.combine_documents.map_reduce import MapReduceDocumentsChain
from langchain.chains.combine_documents.reduce import ReduceDocumentsChain
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain.chains.llm import LLMChain
from langchain_core.language_models import BaseLLM
from langchain_core.prompts import PromptTemplate


class AiChains:
    def __init__(self, llm: BaseLLM):
        self.__map_chain = LLMChain(
            llm=llm,
            prompt=PromptTemplate.from_template(
                "Summarize this content: {docs}"
            )
        )

        self.__reduce_chain = LLMChain(
            llm=llm,
            prompt=PromptTemplate.from_template("""
The following is set of summaries and raw source codes.
Take these and distill it into a final, consolidated summary of the main themes.
----------
{docs}
----------
CONSOLIDATED SUMMARY: 
"""
            )
        )

        self.__readme_combine_chain = LLMChain(
            llm=llm,
            prompt=PromptTemplate.from_template("""
You are an useful repository readme file generator.

You must generate README.md template according to repository content according to files below, in Korean.

Take the summaries and generate README.md following paragraphs:
  - 주제
  - 서비스 설명
  - 프로젝트 전체 구현 기능
  - 기술 스택
  - 기대 효과
  
Each paragraph should be separated with "##"(Heading level 2).
'프로젝트 전체 구현 기능' paragraph should contains brief comment about benefits of the functions.
'기술 스택' paragraph should be written by listing keywords, not exceeding 10 items.
'기대 효과' paragraph should contain expected experience and benefits from the app's features to users.

Summaries:
{docs}

----------
README.md:
""")
        )

        self.__commit_combine_chain = LLMChain(
            llm=llm,
            prompt=PromptTemplate.from_template("""You are an useful code judge.
You must judge the code of the given commits, following some criteria, and brief a comment.

The criteria are:
 * Readability: How easy is it to read and understand the code?
 * Reusability: How much the code has been reused, and have few duplicates?
 * Performance: How quick the code perform its intended function?
 * Testability: Is the code easy to test and debug?
 * Exception Handling: Are there proper exception handling mechanisms implemented in the code?

The scores must be integers, out of 100.

The output form should be following JSON. Answer with only JSON.:
{{
    "readability": <readability score>
    "reusability": <reusability score>
    "performance": <performance score>
    "testability": <testability score>
    "exception": <exception handling score>
    "scoreComment": <brief comment about judgement criterion in Korean plain text>
}}

Summaries:
{docs}

Answer:
""")
        )

        self.__collapse_documents_chain = StuffDocumentsChain(
            llm_chain=self.__reduce_chain, document_variable_name="docs"
        )

        self.__readme_combine_documents_chain = StuffDocumentsChain(
            llm_chain=self.__readme_combine_chain, document_variable_name="docs"
        )

        self.__commit_combine_documents_chain = StuffDocumentsChain(
            llm_chain=self.__commit_combine_chain, document_variable_name="docs"
        )

        self.__readme_reduce_documents_chain = ReduceDocumentsChain(
            # This is final chain that is called.
            combine_documents_chain=self.__readme_combine_documents_chain,
            # If documents exceed context for `StuffDocumentsChain`
            collapse_documents_chain=self.__collapse_documents_chain,
            # The maximum number of tokens to group documents into.
            token_max=3000,
        )

        self.__commit_reduce_documents_chain = ReduceDocumentsChain(
            # This is final chain that is called.
            combine_documents_chain=self.__commit_combine_documents_chain,
            # If documents exceed context for `StuffDocumentsChain`
            collapse_documents_chain=self.__collapse_documents_chain,
            # The maximum number of tokens to group documents into.
            token_max=3000,
        )

        self.readme_map_reduce_chain = MapReduceDocumentsChain(
            # Map chain
            llm_chain=self.__map_chain,
            # Reduce chain
            reduce_documents_chain=self.__readme_reduce_documents_chain,
            # The variable name in the llm_chain to put the documents in
            document_variable_name="docs",
            # Return the results of the map steps in the output
            return_intermediate_steps=False
        )

        self.commit_map_reduce_chain = MapReduceDocumentsChain(
            # Map chain
            llm_chain=self.__map_chain,
            # Reduce chain
            reduce_documents_chain=self.__commit_reduce_documents_chain,
            # The variable name in the llm_chain to put the documents in
            document_variable_name="docs",
            # Return the results of the map steps in the output
            return_intermediate_steps=False
        )