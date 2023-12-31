// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { Card, CardBody, CardText, Row, Col, Button } from 'reactstrap'
import moment from 'moment'

import { useHistory, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { deleteProduct, getAllData } from '../store/action'

const MySwal = withReactContent(Swal)

const UserInfoCard = ({ selectedProduct }) => {
	const renderImg = () => {
		if (selectedProduct !== null && selectedProduct.image) {
			return <img src={selectedProduct.image} alt="user-avatar" className="img-fluid rounded" height="104" width="104" />
		} else {
			const stateNum = Math.floor(Math.random() * 6),
				states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
				color = states[stateNum]
			return (
				<Avatar
					initials
					color={color}
					className="rounded"
					content={`${selectedProduct.name.split(' ')[0]} ${selectedProduct.name.split(' ')[1]}`}
					contentStyles={{
						borderRadius: 0,
						fontSize: 'calc(36px)',
						width: '100%',
						height: '100%',
					}}
					style={{
						height: '90px',
						width: '90px',
					}}
				/>
			)
		}
	}
	const history = useHistory()
	const dispatch = useDispatch()

	// ** Handle Delete
	const handleDelete = async (id) => {
		return MySwal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
			customClass: {
				confirmButton: 'btn btn-primary',
				cancelButton: 'btn btn-outline-danger ml-1',
			},
			buttonsStyling: false,
		}).then(async function (result) {
			if (result.value) {
				const deleted = await dispatch(deleteProduct(id))
				if (deleted) {
					await dispatch(getAllData())
					MySwal.fire({
						icon: 'success',
						title: 'Deleted!',
						text: 'Product has been deleted.',
						customClass: {
							confirmButton: 'btn btn-primary',
						},
					})
					history.push(`/products/list`)
				}
			}
		})
	}

	const getProductData = (id, type = 'qty') => {
		const store = useSelector((state) => state.sales)
		console.log({store})
		const newArr = []
		store.allData?.forEach((p) => {
			const itExists = p.products.find((item) => item.id === id)
			console.log({itExists})
			if (itExists) {
				newArr.push(itExists)
			}
		})
		console.log({newArr})
		return type === 'qty'
			? newArr.map((item) => item?.qty).reduce((prev, curr) => prev + curr, 0)
			: newArr.map((item) => item?.total).reduce((prev, curr) => prev + curr, 0)
	}

	const getProductReceived = () => {
		const received = selectedProduct?.inventory?.inventoryHistories.filter((item) => item.type === 'OUT')
		console.log({received})
		return received.map((item) => item?.qty).reduce((prev, curr) => prev + curr, 0)
	}

	return (
		<Card>
			<CardBody>
				<Row>
					<Col xl="4" lg="12" className="d-flex flex-column justify-content-between border-container-lg">
						<div className="user-avatar-section">
							<h3>Product Details</h3>
							<div className="d-flex justify-content-start">
								{renderImg()}
								<div className="d-flex flex-column ml-1">
									<div className="user-info mt-1 mb-1">
										<h4 className="mb-0">{selectedProduct.name}</h4>
									</div>
									<div className="d-flex flex-wrap align-items-center">
										<Button.Ripple tag={Link} to={`/products/edit/${selectedProduct.id}`} color="primary">
											Edit
										</Button.Ripple>
										<Button.Ripple className="ml-1" color="danger" outline onClick={() => handleDelete(selectedProduct.id)}>
											Delete
										</Button.Ripple>
									</div>
								</div>
							</div>
							<div className="d-flex align-items-center mr-2 mt-1">
								{/* <div className='color-box'>
                  <span>Description: </span>
                </div> */}
								<div className="ml-0">
									<h6 className="mb-0">{selectedProduct.description || ''}</h6>
								</div>
							</div>
						</div>
					</Col>
					<Col xl="4" lg="12" className="d-flex flex-column justify-content-between border-container-lg">
						<div className="user-avatar-section">
							{/* <h3>Product Details</h3> */}
							<div className="d-flex align-items-center mr-2 mt-1">
								<div className="color-box">
									<span>Product Id: </span>
								</div>
								<div className="ml-1">
									<h6 className="mb-0">{selectedProduct.id}</h6>
								</div>
							</div>
							<div className="d-flex align-items-center mr-2 mt-1">
								<div className="color-box">
									<span>Product Price: </span>
								</div>
								<div className="ml-1">
									<h6 className="mb-0">{(selectedProduct.price || 0).toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}</h6>
								</div>
							</div>
							<div className="d-flex align-items-center mr-2 mt-1">
								<div className="color-box">
									<span>Type: </span>
								</div>
								<div className="ml-1">
									<h6 className="mb-0">{selectedProduct.type}</h6>
								</div>
							</div>
						</div>
					</Col>
					<Col xl="4" lg="12" className="d-flex flex-column justify-content-between border-container-lg">
						<div className="user-avatar-section">
							{/* <h3>Product Details</h3> */}
							<div className="d-flex align-items-center mr-2 mt-1">
								<div className="color-box">
									<span>Qty Sold: </span>
								</div>
								<div className="ml-1">
									<h6 className="mb-0">{getProductData(selectedProduct.id) || 0} ( {(getProductData(selectedProduct.id, 'amount') || 0).toLocaleString('en-US', { style: 'currency', currency: 'NGN' })} )</h6>
								</div>
							</div>
							<div className="d-flex align-items-center mr-2 mt-1">
								<div className="color-box">
									<span>QTY Available: </span>
								</div>
								<div className="ml-1">
									<h6 className="mb-0">
										{(selectedProduct.type === 'DRINKS' && selectedProduct.inventory) ? (Number(getProductReceived()) - Number(getProductData(selectedProduct.id) || 0)) : 'N/A'}
									</h6>
								</div>
							</div>
						</div>
					</Col>
				</Row>
			</CardBody>
		</Card>
	)
}

export default UserInfoCard
