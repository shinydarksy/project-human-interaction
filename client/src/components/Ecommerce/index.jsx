import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import ImageGrind from './ImageGrid'
import MainImage from './MainImage'
import InforImage from './InforImage'
import { useSelector } from 'react-redux'
// import Map from './Map'
import TopNav from '../TopNav'
import { menu } from '../../pages/data'

export default function Ecommerce(props) {
    const [selectImage, setSelectImage] = useState(0)
    const animals = useSelector(state => state.animals.animalList)
    const [data,setData] = useState()

    useEffect(() => {  
        const params = new URLSearchParams(props.location.search);
        const id_animal = params.get('id');       
        const animalDetail = animals.find((element=>element.ma_dv.toString()===id_animal))
        setData(animalDetail)
    },[data,animals,props])
    let images = []

    if(data){
        images = data.images.map((image)=>{
            return image.lien_ket
        })
    }

    return (
        <>
            <TopNav menu={menu} />
            <Grid container spacing={5} style={{ margin: "0 auto", maxWidth: 1100, marginTop: 62 }} >
                <Grid item container sm={12} md={6} alignItems="center" justifyContent="center">
                    <Grid item >
                        <MainImage src={images[selectImage]} />
                    </Grid >
                    <Grid item style={{ textAlign: 'center' }}>
                        {images.length>1 && <ImageGrind images={images} onSelection={image => setSelectImage(image)} />}
                    </Grid>
                </Grid>

                <Grid item sm={12} md={6} >
                    <InforImage data={data}/>
                </Grid >
                {/* <Grid item sm={4}>
                    <div style={{width:'100%',height:'50px'}}>
                        <Map arrLocation={[]}/>
                    </div>
                </Grid > */}
            </Grid>
        </>
    )
}
