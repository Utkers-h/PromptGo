"use client"
import { useState, useEffect } from 'react'
import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {/* it will reterive the data we get from the posts response */}
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};



const Feed = () => {
  const [posts, setPosts] = useState([]);

  // Search states
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };



  // From our feed we will have to make a get request to fetch the data, can be implemented by useEffect

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();

      setPosts(data);
    }
    fetchPosts();
  }, []);


  // chat gpt prompt generator
  const [value, setValue] = useState("");
  const [res, setRes] = useState("");
  const [output, setOutput] = useState("");

  const calculate = (value) => {
    if (value.trim() !== "") {
      fetch("https://merve-chatgpt-prompt-generator.hf.space/run/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [value],
          duration: 25.0,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          const data = r.data[0] || ""; // assuming the API returns an array of data
          setRes(data);
          setOutput(data);
        });
    }
  };

  // clearing the input prompt
  const clearInput = () => {
    setValue("");
    setRes("");
    setOutput("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <section className='feed'>
      {/* Search box  */}
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      {/* Displaying of prompts according to the search or else display all posts */}
      
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
      

      {/* Prompt generator section */}
      <div className="App text-center p-8 prompt_card w-auto h-auto">
        <h1 className="text-2xl font-bold mb-4 orange_gradient">Prompt Generator</h1>
        <label className="block mb-2  font-satoshi font-semibold">Problem Statement </label>
        <input
          className="border border-gray-300 p-2 mb-4 w-full search_input"
          value={value}
          placeholder='Enter your problem statement'
          onChange={(e) => setValue(e.target.value)}
        ></input>
        {/* <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
          onClick={() => calculate(value)}
          disabled={value.trim() === ""}
        >
          Generate
        </button> */}
        <button
          className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-full group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500
         group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 "
          onClick={() => {
            calculate(value);
            // Clear the output after generating once
            setOutput("");
          }}
          disabled={value.trim() === ""}
        >
          <span className="relative px-5 py-2.5 rounded-md group-hover:bg-opacity-0">
            Generate
          </span>
        </button>


        <button
          className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded-full ml-2"
          onClick={clearInput}
        >
          Clear
        </button>

        <h1 className="text-2xl font-semibold mt-8 mb-4 green_gradient drop-shadow-md">Output</h1>
        <textarea
          className="border border-gray-300 p-2 mb-4 w-full form_textarea"
          value={output}
          rows="4"
          cols="50"
          readOnly
        ></textarea>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-semibold font-satoshi py-2 px-4 rounded-full drop-shadow-lg"
          onClick={copyToClipboard}
        >
          Copy
        </button>

      </div>

    </section>
  )
}

export default Feed
