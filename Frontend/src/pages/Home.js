import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import brewApi from '../utils/brewApi';
import { TYPES } from '../utils/constants';
import StarFillIcon from '../components/StarFillIcon';
import api from '../utils/api';

export default function Home() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const by_city = searchParams.get('by_city') || "";
    const search = searchParams.get('search') || "";
    const type = searchParams.get('type') || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterMenu, setFilterMenu] = useState(false);
    const [reviews, setReviews] = useState(null)
    const navigate = useNavigate()
    const addParam = (key, value) => {
        setSearchParams({search, type, by_city, [key]: value})
    }
    const [error, setError] = useState("")
    const loadRandom = async() => {
        const res = await brewApi.get("/breweries/random", {params: {size: 20}})
        const res1 = await api.get('/review', {params: {ids: res.data.map(i => i.id).join('+')}})
        return {data: res.data, reviews: res1.data};
    }
    const doSearch = async() => {
        const params = {};
        if(by_city==="true") params.by_city = search;
        else params.by_name = search;
        if(type) params.by_type = type;
        const res = await brewApi.get("/breweries", {params})
        const res1 = await api.get('/review', {params: {ids: res.data.map(i => i.id).join('+')}})
        return {data: res.data, reviews: res1.data};
    }
    const retry = async() => {
        try {
            setLoading(true);
            setError("");
            let res;
            if(!search && by_city!=="true" && !type) {
                res = await loadRandom();
            } else {
                res = await doSearch();
            }
            setResults(res.data);
            setReviews(res.reviews);
        } catch (error) {
            console.error(error)
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        retry();
    }, [search, by_city, type])
    return (
        <div className="bg-gray-200 h-full flex justify-center">
            <div className="h-full w-full md:w-3/5 flex flex-col">
                <div className='bg-gray-300 m-8 py-4 px-4 rounded-2xl flex flex-row items-center'>
                    <input value={search} onChange={e => addParam("search", e.target.value)} className="outline-none bg-transparent flex-1" placeholder="Search Breweries" />
                    <div className={`loader !w-5 !border-2 !border-gray-500 mr-4 ${loading?'':'hidden'}`} />
                    {by_city==="true"?(
                        <div className="px-2 py-1 cursor-pointer rounded-xl bg-gray-400 flex flex-row items-center mr-2" onClick={() => addParam("by_city", "false")}>
                            Search By City
                            <img src={require('../assets/close.png')} className="w-2 ml-2" />
                        </div>
                    ):null}
                    {type?(
                        <div className="px-2 py-1 cursor-pointer rounded-xl bg-violet-400 flex flex-row items-center" onClick={() => addParam("type", "")}>
                            {TYPES[type]}
                            <img src={require('../assets/close.png')} className="w-2 ml-2" />
                        </div>
                    ):null}
                    <button className="py-1 px-3" onClick={() => setFilterMenu(true)}>
                        <img src={require('../assets/filter.png')} className="h-6 w-6" />
                    </button>
                    <div onClick={() => setFilterMenu(false)} className={`${filterMenu?"block":"hidden"} fixed top-0 left-0 z-30 right-0 bottom-0`} />
                    <div className="relative border-2">
                        <div className={`${filterMenu?"block":"hidden"} shadow-lg absolute z-30 mt-4 bg-white right-0 min-w-64`}>
                            <div className="w-full flex flex-row items-center px-2 py-3 border-b-[1px] bordder-b-solid border-b-gray-100" onClick={() => addParam("by_city", by_city==="true"?"false":"true")}>
                                <div className="w-4 mr-3 ml-1">{by_city==="true"?<img className="" src={require('../assets/check.png')} />:null}</div>
                                Search by city
                            </div>
                            {Object.keys(TYPES).map(i => (
                                <div key={i} className="w-full flex flex-row items-center px-2 py-3" onClick={() => addParam("type", type===i?"":i)}>
                                    <div className="w-4 mr-3 ml-1">{type===i?<img className="" src={require('../assets/check.png')} />:null}</div>
                                    {TYPES[i]}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {error?(
                    <div className="text-center mt-[100px] text-red-500 text-lg">
                        {error}<br />
                        <button className="mt-1 text-blue-800 text-center text-sm" onClick={retry}>Retry</button>
                    </div>
                ):!results.length?(
                    <div className="text-center mt-[100px] text-gray-700">
                        Oops! Nothing in here.
                    </div>
                ):(
                    <div className="overflow-auto flex-1 min-h-1">
                        {results.map((i,ii) => (
                            <div className="p-4 mx-8 my-1 bg-white rounded-lg" key={ii}>
                                <div className="flex flex-row justify-between">
                                    <div>
                                        <div className="text-xl cursor-pointer" onClick={() => navigate("/brew/"+i.id)}>{i.name}</div>
                                        <div className="text-sm text-gray-500">{i.address_1 ? i.address_1+", ":""}{i.city}</div>
                                        <div className="text-sm text-gray-500">{i.state_province}, {i.country}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-right">{reviews && reviews[i.id]?(
                                            <div className="flex flex-row justify-end items-center gap-1">{Math.floor(reviews[i.id].total*10/reviews[i.id].count)/10} <span className="text-yellow-500"><StarFillIcon /></span> ({reviews[i.id].count})</div>
                                        ):(
                                            <span className="text-transparent">-</span>
                                        )}</div>
                                        <div className="text-sm text-gray-500">
                                            {i.website_url?<a href={i.website_url}>{i.website_url}</a>:null}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {i.phone?<a href={`tel:+${i.phone}`}>+{i.phone}</a>:null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="h-[50px]" />
                    </div>
                )}
            </div>
        </div>
    )
}