'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { GET_PROJECT_LIST_URL } from '../utilities/urls';
import SkeletonCard from '@/components/SkeletonCard';
import Newcard from '@/components/Newcard';

export default function Portfolio() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(GET_PROJECT_LIST_URL);
                console.log(res)
                setData(res.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        }
        fetchData();
    }, []);
    useEffect(() => {
        if (data.length > 0) {
            setLoading(false);
        }
    }, [data]);

    return (
        <div className="container grid lg:grid-cols-1 gap-8 mx-auto pb-40  ">

            {
                loading ?
                    [1, 2, 3, 4, 5, 6].map(e => <SkeletonCard key={e}></SkeletonCard>)
                    :
                    data.map((project: any) => {
                        return (
                            <Newcard
                                key={project._id}
                                project={project}
                            />
                        )
                    })
            }
        </div>
    )
}
