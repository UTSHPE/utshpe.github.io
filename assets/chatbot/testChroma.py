from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

persist_dir = "chroma_db"
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

new_db = Chroma(persist_directory=persist_dir, embedding_function=embeddings)

# Example query on the loaded DB
query = "What mentorship programs does UT SHPE offer?"
matching_docs = new_db.similarity_search(query)

print(matching_docs)