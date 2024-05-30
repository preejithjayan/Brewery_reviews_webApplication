import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import brewApi from '../../utils/brewApi';
import StarFillIcon from '../../components/StarFillIcon';
import { TYPES } from '../../utils/constants';
import api from '../../utils/api';
import Rating from '../../components/Rating';
import Button from '../../components/Button';

const relativeTime = (ms) => {
    const now = Date.now();
    let gap = (now - ms)/1000;
    if(gap<60)
        return "Just Now"
    gap = gap/60;
    if(gap<60)
        return Math.floor(gap)+" mins ago"
    gap = gap/60;
    if(gap<24)
        return Math.floor(gap)+" hours ago"
    return Math.floor(gap/24)+" days ago"
}

export default function Brew() {
    const {id} = useParams()
    const [brew, setBrew] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("")
    const [stars, setStars] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")
    useEffect(() => {
        const prom1 = brewApi.get('/breweries/'+id).then(res => {
            setBrew(res.data)
        }).catch(e => {
            console.error(e)
            setBrew(null)
        })
        const prom2 = api.get('/review/by-brew/'+id).then(res => {
            setReviews(res.data)
        }).catch(e => {
            console.error(e)
            setReviews(null)
        })
        Promise.all([prom1, prom2]).then(() => setLoading(false))
    }, [])
    const handleSubmit = async() => {
        setSubmitting(true)
        setSubmitError("")
        try {
            await api.post('/review', {comment, rating: stars, brewId: id})
            const res = await api.get('/review/by-brew/'+id)
            setReviews(res.data)
        } catch(error) {
            setSubmitError("Something went wrong. Please try again")
        } finally {
            setSubmitting(false)
        }
    }
    if(loading)
        return <div className="w-full h-full flex items-center justify-center"><div className="loader !w-12 !border-gray-400 !border-4" /></div>
    if(!brew)
        return <div className="w-full h-full flex items-center justify-center text-gray-600 text-xl">Brewery Not Found.</div>
    return (
        <div className="h-full overflow-auto flex flex-col items-center bg-gray-100">
            <div className="h-full w-full sm:w-3/5">
                <div className="bg-white my-2 p-4">
                    <div className="text-bold text-4xl mb-4">{brew.name}</div>
                    <div className="flex flex-row justify-between">
                        <div className="">
                            <div className='text-gray-500'>{brew.address_1 ? brew.address_1+", ":""}{brew.city}</div>
                            <div className='text-gray-500'>{brew.state_province}, {brew.country}</div>
                        </div>
                        {reviews?<div className="flex flex-row items-center">
                            <div className="mr-2">Rating</div> {reviews?.total ? Math.floor(reviews.total*10/reviews.count)/10 : '-'} <div className="mx-1 text-yellow-500"><StarFillIcon /></div> ({reviews?.count || '-'})
                        </div>:null}
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between mt-3 text-gray-600 lg:gap-4 pb-4 border-b-gray-200 border-b-2">
                        <div className="">Type: {TYPES[brew.brewery_type]}</div>
                        <div className="">Phone: {brew.phone? <a href={'tel:+'+brew.phone}>+{brew.phone}</a> : "-"}</div>
                        <div className="">{brew.website_url? <a href={brew.website_url}>{brew.website_url}</a> : null}</div>
                    </div>
                    <div className="p-2">
                        {reviews?(
                            <div className="">
                                {reviews.reviews.map(i => (
                                    <div className="flex flex-row justify-between py-4 items-center border-b-2 border-b-gray-200">
                                        <div>
                                            <div className="font-bold text-gray-700 text-xl mr-2">{i.user}</div>
                                            <div className="">{i.comment}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex flex-row justify-end items-center gap-1">
                                                {i.rating}
                                                <div className="flex flex-row text-yellow-500 gap-[2px] ml-1">
                                                    <Rating value={i.rating} />
                                                </div>
                                                {/* <span className="text-gray-500"><StarFillIcon /></span> */}
                                            </div>
                                            <div className="text-gray-700">{relativeTime(new Date(i.time).getTime())}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ):(
                            <div className="text-gray-400 my-8 text-center">No reviews yet.</div>
                        )}
                        {reviews?.reviewed?(
                            <div className="mt-2 text-gray-400">You have already reviewed this product.</div>
                        ):(
                            <>
                                <div className="mt-8 text-gray-500">
                                    Your Feedback
                                </div>
                                <div className="flex flex-row p-2 mt-1 border-2 border-gray-200 rounded-lg">
                                    <textarea onChange={e => setComment(e.target.value)} type="text" placeholder="Enter your feedback" className="flex-1 max-h-32 min-h-16 h-32 outline-none" />
                                    <div className="flex flex-row gap-1 text-yellow-600 mt-2">
                                        <Rating size={24} value={stars} setValue={setStars} />
                                    </div>
                                </div>
                                <Button onClick={handleSubmit} label="Send Feedback" className="w-full rounded-xl mt-2" disabled={!stars || !comment.length || submitting} />
                                <div className="text-center text-red-500">{submitError}</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}