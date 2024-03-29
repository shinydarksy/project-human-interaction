import React, { useState, useEffect, useMemo } from 'react'
import AnimalCard from '../AnimalCard'
import AddIcon from '@material-ui/icons/Add'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import SearchBar from 'material-ui-search-bar'
import axios from 'axios'
import AddAnimalForm from '../Forms/AddAnimal'
import animalAPI from '../../api/animalAPI'
import { getAnimalList } from '../../redux/animalSlice'
import EditAnimalForm from '../Forms/EditAnimal'
import { apiUrls_animalfamily } from '../../api/apiUrls'

export default function AnimalBoard() {
	const [open, setOpen] = useState(false)
	const [editAnimal, setEditAnimal] = useState(null)
	const [editAnimalModal, setEditAnimalModal] = useState(false)
	const [searchText, setSearchText] = useState('')
	const [animalFamily, setAnimalFamily] = useState([])

	const [page, setPage] = useState(1);
	const handleChange = (event, value) => {
		setPage(value);
	};

	const dispatch = useDispatch()
	let animals = useSelector(state => state.animals.animalList)
	console.log(animals);
	if (searchText.trim()) {
		animals = animals.filter((animal) => (animal.ten_dv.toLowerCase().search(searchText.toLowerCase()) >= 0))
	}

	let totalPage = animals.length % 12 === 0 ? (animals.length - animals.length % 12) / 12 : (animals.length - animals.length % 12) / 12 + 1

	animals = animals.slice((page - 1) * 12, page * 12);

	useEffect(() => {
		function loadData() {
			axios
				.get(`${apiUrls_animalfamily}/getAnimalFamilyList`)
				.then(({ data }) => {
					setAnimalFamily(data.content)
				})
		}
		loadData()
	}, [])

	const animalFamilyOptions = useMemo(() => {
		return animalFamily.map(item => ({
			value: item.ma_ho,
			label: item.ten_ho,
		}))
	}, [animalFamily])

	function handleEditAnimal(animal) {
		setEditAnimal(animal)
		setEditAnimalModal(true)
	}

	function renderCardList() {

		return animals.map((animal, index) => {
			return (
				<div
					className="col-6 col-sm-4 col-md-2 grid-layout__column"
					key={index}
				>
					<AnimalCard
						animal={animal}
						isadmin={true}
						onEdit={handleEditAnimal}
						onDelete={handleDeleteAnimal}
					/>
				</div>
			)
		})
	}

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	async function handleAddAnimal(data) {
		const formData = new FormData()

		Object.entries(data).forEach(([key, value]) => {
			if (key === 'images') {
				for (const file of value) {
					formData.append(key, file)
				}
				return
			}
			formData.append(key, value)
		})

		try {
			const response = await animalAPI.insertAnimal(formData)
			setOpen(false)
			dispatch(getAnimalList())
			alert(response.data.message)
		} catch (err) {
			alert('Đã xảy ra lỗi!')
		}
	}

	async function handleEditAnimalForm(data) {
		try {
			const response = await animalAPI.updateAnimal(data)
			setEditAnimalModal(false)
			dispatch(getAnimalList())
			alert(response.data.message)
		} catch (err) {
			alert('Đã xảy ra lỗi!')
		}
	}

	async function handleDeleteAnimal(id) {
		try {
			const response = await animalAPI.deleteAnimal(id)
			dispatch(getAnimalList())
			alert(response.data.message)
		} catch (err) {
			alert('Đã xảy ra lỗi!')
		}
	}

	function handleSearch(e) {
		setSearchText(e);
		setPage(1)
	}

	return (
		<div className="layout-animal">
			<div className="title">
				<h3>Quản lý danh sách động vật</h3>
			</div>
			<div className="search-input">
				<SearchBar
					placeholder="Tìm kiếm động vật"
					className="search-bar"
					onChange={handleSearch}
					onRequestSearch={handleSearch}
				/>
			</div>

			<div className="grid-layout ">
				<div className="container">
					<div className="gp-btn">
						<button
							className="add-animal-btn"
							onClick={handleClickOpen}
							style={{ marginBottom: '30px', height: 40 }}
						>
							<AddIcon />
							Thêm
						</button>

					</div>
					<div className="row" style={{ minHeight: 360 }}>{renderCardList()}</div>
					<div className="num_page">
						{totalPage > 1 && <Pagination
							count={totalPage}
							showFirstButton
							showLastButton
							onChange={handleChange}
						/>}
					</div>
				</div>
			</div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle style={{ textAlign: 'center' }}>Thêm con vật</DialogTitle>
				<DialogContent>
					<AddAnimalForm
						onSubmit={handleAddAnimal}
						onClose={handleClose}
						animalFamilyOptions={animalFamilyOptions}
					/>
				</DialogContent>
			</Dialog>
			<Dialog open={editAnimalModal} onClose={() => setEditAnimalModal(false)}>
				<DialogTitle style={{ textAlign: 'center' }}>
					Cập nhật con vật
				</DialogTitle>
				<DialogContent>
					<EditAnimalForm
						onSubmit={handleEditAnimalForm}
						onClose={() => setEditAnimalModal(false)}
						animal={editAnimal}
						animalFamilyOptions={animalFamilyOptions}
					/>
				</DialogContent>
			</Dialog>
		</div>
	)
}
