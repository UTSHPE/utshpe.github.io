import pandas as pd
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

csv_file_path = './assets/knowledge_data/ut_shpe_data.csv'

data = pd.read_csv(csv_file_path)

documents = [{"page_content": row["data"], "metadata": {"type": row["metadata"]}}
             for index, row in data.iterrows()]

# Define a function to convert these dicts to Document objects if needed by Langchain
class Document:
    def __init__(self, page_content, metadata):
        self.page_content = page_content
        self.metadata = metadata

def load_docs(data):
    return [Document(**doc) for doc in data]

documents = load_docs(documents)

# Split the documents
def split_docs(documents, chunk_size=1000, chunk_overlap=20):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    docs = text_splitter.split_documents(documents)
    return docs

docs = split_docs(documents)
print(len(docs))

# Embed the text
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

persist_dir = "chroma_db"
vectorDB = Chroma.from_documents(documents=docs, embedding=embeddings, persist_directory= persist_dir)

#create folder for vectorDB housing
vectorDB.persist()

