import React from 'react'
import { Grid } from '@mui/material'

function OrderCard() {
    return (
        <div className='p-4 shadow-md bg-white rounded-md mb-4'>
            <Grid container alignItems="center" justifyContent="space-between">

                {/* Product Info */}
                <Grid item xs={6}>
                    <div className='flex cursor-pointer'>
                        <img
                            className='w-20 h-20 object-cover object-top rounded'
                            src="/shirt1.jpg"
                            alt="product"
                        />
                        <div className='ml-5 space-y-1'>
                            <p className='font-semibold text-sm'>Men Slims Mid Rise Black Jeans</p>
                            <p className='opacity-50 text-xs font-semibold'>Size: M</p>
                            <p className='opacity-50 text-xs font-semibold'>Color: Black</p>
                        </div>
                    </div>
                </Grid>

                {/* Price */}
                <Grid item xs={2}>
                    <p className='font-semibold'>₹199</p>
                </Grid>

                {/* Delivery Status — ✅ added item prop */}
                <Grid item xs={4}>
                    {true && (
                        <p className='text-sm'>
                            <span className='font-semibold text-green-600'>✔ Delivered</span>
                            <br />
                            <span className='text-gray-500 text-xs'>on March 03</span>
                        </p>
                    )}
                    {false && (
                        <p className='text-sm text-gray-500'>
                            Expected Delivery on March 03
                        </p>
                    )}
                </Grid>

            </Grid>
        </div>
    )
}

export default OrderCard