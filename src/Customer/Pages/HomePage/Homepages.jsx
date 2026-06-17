import React from 'react'
import MainCarousel from '../../Components/HomeCarousel/MainCarousel'
import HomeSectionCard from '../../Components/HomeSectionCard/HomeSectionCard'
import {
  mens_kurta, mens_shoes, mens_shirt,
  womens_saree, womens_dress, electronics,
  beauty_products, kids_wear, home_decor, watches,
} from "../../../Data/data";

function Homepages() {
  return (
    <>
      <MainCarousel />

      <div className="space-y-10 py-10">
        <HomeSectionCard data={mens_kurta}       sectionName="Men's Kurta"       category="mens_kurta"       />
        <HomeSectionCard data={mens_shoes}        sectionName="Men's Shoes"        category="mens_shoes"        />
        <HomeSectionCard data={mens_shirt}        sectionName="Men's Shirt"        category="mens_shirt"        />
        <HomeSectionCard data={womens_saree}      sectionName="Women's Saree"      category="womens_saree"      />
        <HomeSectionCard data={womens_dress}      sectionName="Women's Dress"      category="womens_dress"      />
        <HomeSectionCard data={electronics}       sectionName="Electronics"        category="electronics"       />
        <HomeSectionCard data={beauty_products}   sectionName="Beauty Products"    category="beauty_products"   />
        <HomeSectionCard data={kids_wear}         sectionName="Kids Wear"          category="kids_wear"         />
        <HomeSectionCard data={home_decor}        sectionName="Home Decor"         category="home_decor"        />
        <HomeSectionCard data={watches}           sectionName="Watches"            category="watches"           />
      </div>
    </>
  )
}

export default Homepages