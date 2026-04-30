import React,{use, useState} from 'react'
import Editor from '@monaco-editor/react'

const CodeEditor = () => {
  const  [value,setValue]=useState('')

  const handleEditorChange=(newValue)=>{
    setValue(newValue)
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      
      <div className="border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
    <Editor
          height="60vh"
          theme="vs-dark"
          defaultLanguage="javascript"
          value={value}
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false }, // Keeps it minimalist
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
      </div>

  );
}

export default CodeEditor
