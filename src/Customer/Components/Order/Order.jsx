import React from 'react'
import { Grid } from '@mui/material'
import OrderCard from './OrderCard'

const orderStatus = [
    { value: "on_the_way",  label: "On The Way" },
    { value: "delivered",   label: "Delivered"  },
    { value: "returned",    label: "Returned"   },
    { value: "cancelled",   label: "Cancelled"  },
]

function Order() {
    return (
        <div className='px-10 py-5'>
            <Grid container spacing={4}>

                {/* Filter Sidebar */}
                <Grid item xs={12} lg={2}>
                    <div className='shadow-md bg-white p-5 rounded-md sticky top-5'>
                        <h1 className='font-bold text-lg'>Filters</h1>

                        <div className='space-y-3 mt-6'>
                            <h1 className='font-semibold text-sm uppercase tracking-wide text-gray-700'>
                                Order Status
                            </h1>

                            {orderStatus.map((option) => (
                                <div key={option.value} className='flex items-center gap-2'>
                                    <input
                                        id={option.value}
                                        value={option.value}
                                        type="checkbox"
                                        className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer'
                                    />
                                    <label
                                        htmlFor={option.value}
                                        className='text-sm text-gray-600 cursor-pointer'
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </Grid>

                {/* Orders List */}
                <Grid item xs={12} lg={10}>
                    <div className='space-y-3'>
                        <OrderCard />
                        <OrderCard />
                        <OrderCard />
                    </div>
                </Grid>

            </Grid>
        </div>
    )
}

export default Order