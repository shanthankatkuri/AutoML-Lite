import os
import pandas as pd
from dotenv import load_dotenv
import google.generativeai as genai
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
genai.configure(api_key=GOOGLE_API_KEY) 
# for model in genai.list_models():
#     print(model.name)
def generate_pandas_code(query, df):
    try:
        print(f"⏳ Received query: {query}")
        
        # Ensure DataFrame is loaded and columns are available
        if df.empty:
            print("❌ Error: DataFrame is empty or not loaded.")
            return None

        # List columns properly
        columns = ", ".join(f"{col} ({dtype})" for col, dtype in zip(df.columns, df.dtypes))
        print(f"📊 Columns info: {columns}")

        # Template with dynamic columns info
        prompt_template = """
You are a helpful assistant that converts natural language questions into pandas code.
Use the dataframe `df` with the following columns: {columns}

Translate the user's question into valid Python code that uses pandas to answer the question.
Only return the code. Do not explain anything.

Question: {query}
Python Code:
""".strip()

        # Generate the code using Gemini
        prompt = PromptTemplate(template=prompt_template, input_variables=["columns", "query"])
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro", temperature=0)
        chain: RunnableSequence = prompt | llm

        response = chain.invoke({"columns": columns, "query": query})
        print("✅ Gemini raw response:", response)

        if hasattr(response, "content"):
            return response.content.strip()
        elif isinstance(response, str):
            return response.strip()
        else:
            print("⚠️ Unexpected response type:", type(response))
            return None

    except Exception as e:
        import traceback
        print("❌ Full Exception:")
        traceback.print_exc()
        return None
