<template>
	<div>
		<loading :active.sync="isLoading" ></loading>
		<div class="row mt-4">
			<div class="col-md-4 mb-4" v-for="(item,$index) in products" :key="$index">
				<div class="card border-0 shadow-sm" >
					<div style="height: 150px; background-size: cover; background-position: center"
						:style="{backgroundImage:`url(${item.imageUrl})`}"
					></div>
					<div class="card-body">
						<span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
						<h5 class="card-title">
							<a href="#" class="text-dark">{{item.title}}</a>
						</h5>
						<p class="card-text">{{item.content}}</p>
						<div class="d-flex justify-content-between align-items-baseline">
							<div class="h5" v-if="!item.price">{{item.origin_price}} 元</div>
							<del class="h6" v-if="item.price">原價 {{item.origin_price}} 元</del>
							<div class="h5" v-if="item.price">現在只要 {{item.price}} 元</div>
						</div>
					</div>
					<div class="card-footer d-flex">
						<button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
							<i class="fas fa-spinner fa-spin" v-if="states.loadingItem === item.id"></i>
							查看更多
						</button>
						<button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
							<i class="fas fa-spinner fa-spin" v-if="states.loadingItem === item.id"></i>
							加到購物車
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="mt-6">
			<div class="field_block">
				<div class="field_block_name cl-xl-12 clearfix">
					<div class="cl-xl-6 d-inline-block">品名</div>
					<div class="cl-xl-3 d-inline-block">數量</div>
					<div class="cl-xl-3 d-inline-block">數量</div>
				</div>
			</div>
			<div class="cartList_block clearfix">
				<div class="cartList_block_box clearfix" v-for="(list,$index) in cartLists" :key="$index">
					<div class="cartList_block_box_product cl-xl-6">
						<div class="cartList_block_box_product_trash" @click="removeCartItem(list.id)">
							<i class="far fa-trash-alt"></i>
						</div>
						<div class="cartList_block_box_product_title">
							<span>{{list.product.title}}</span>
						</div>
					</div>
					<div class="cl-xl-3">
						<span class="">{{list.qty}}/{{list.product.unit}}</span>
					</div>
					<div class="cl-xl-3">
						<span class="">{{list.product.price}}</span>
					</div>
				</div>
				<div class="cartList_block_sumAmount cl-xl-12 clearfix">
					<div class="cartList_block_sumAmount_field cl-xl-9">總計</div>
					<div class="cartList_block_sumAmount_price cl-xl-3">{{sumAmount}}</div>
				</div>
				<div class="cartList_block_disscount cl-xl-12 clearfix" v-if="disscountPrice !== sumAmount">
					<div class="cartList_block_disscount_field cl-xl-9">折扣價</div>
					<div class="cartList_block_disscount_price cl-xl-3">{{disscountPrice}}</div>
				</div>
				<div class="cartList_block_promoCode cl-xl-12">
					<input type="text" class="cartList_block_promoCode_input" v-model="coupon_code" placeholder="請輸入優惠碼">
					<button type="button" class="cartList_block_promoCode_useButton" @click="addCouponCode">套用優惠碼</button>
				</div>
				<div class="cartList_block_email cl-xl-12">
					<div class="cartList_block_email_field">Email</div>
					<input type="email" class="cartList_block_email_input" placeholder="請輸入Email">
				</div>

			</div>
		</div>

		<!-- modal -->
		<div class="modal fade" id="productModal" tabindex="-1" role="dialog"
			aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-md" role="document">
				<div class="modal-content border-0">
					<div class="modal-header bg-dark text-white">
						<h5 class="modal-title" id="exampleModalLabel">{{product.title}}</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<img :src="product.imageUrl" class="img-fluid" alt="">
						<blockquote class="blockquote mt-3">
							<p class="mb-0">{{product.content}}</p>
							<footer class="blockquote-footer text-right">{{product.description}}</footer>
						</blockquote>
						<div class="d-flex justify-content-between align-items-baseline">
							<div class="d-flex justify-content-between align-items-baseline">
								<div class="h4" v-if="!product.price">{{product.origin_price}}</div>
								<del class="h6" v-if="product.price">{{product.origin_price}}</del>
								<div class="h5" v-if="product.price">{{product.price}}</div>
							</div>
						</div>
						<select name="" class="form-control mt-3" v-model="product.num">
							<option :value=num v-for="(num,$index) in 10" :key="$index">選購{{num}}{{product.unit}}</option>
						</select>
						<div class="modal-footer">
							<div class="text-muted text-nowrap mr-3">
								小計<strong>{{product.num * product.price}}</strong>元
							</div>
						</div>
						<button type="button" class="btn btn-outline-secondary" data-dismiss="modal"
							@click="addtoCart(product.id,product.num)">加入購物車</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import $ from 'jquery'
	export default {
		name:'CustomerOrder',
		data() {
			return {
				products:[],
				product:[],
				cartLists:[],
				states:{
					loadingItem:''
				},
				sumAmount : 0,
				disscountPrice:0,
				coupon_code:'',
				isLoading:false
			}
		},
		created() {
			this.getProducts()
			this.getCart()
		},
		methods: {
			getProducts(page =  1){
				const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMEPATH}/products?page=${page}`
				const vm = this
				vm.isLoading = true
				this.$http.get(api).then((response) => {
					vm.isLoading = false
					vm.products = response.data.products
					// console.log(vm.products);
					vm.pagination = response.data.pagination
				})
			},
			getProduct(id){
				const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMEPATH}/product/${id}`
				const vm = this
				vm.states.loadingItem = id
				this.$http.get(api).then((response) => {
					$('#productModal').modal('show')
					vm.product = response.data.product
					vm.states.loadingItem = ''
				})
			},
			addtoCart(id,qty = 1){
				const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMEPATH}/cart`
				const vm = this
				const cart = {
					product_id : id,
					qty
				}
				vm.states.loadingItem = id
				this.$http.post(api,{data:cart}).then((response) => {
					vm.states.loadingItem = ''
					vm.getCart()
					$('#productModal').modal('hide')
				})				
			},
			getCart(){
				const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMEPATH}/cart`
				const vm = this
				vm.isLoading = true
				this.$http.get(api).then((response) => {
					vm.cartLists = response.data.data.carts
					vm.sumAmount = response.data.data.total
					vm.disscountPrice = response.data.data.final_total
					// console.log('vm.cartList',response.data.data.total);
					vm.isLoading = false
				})
			},
			removeCartItem(id){
				const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMEPATH}/cart/${id}`
				const vm = this
				vm.isLoading = true
				this.$http.delete(api).then((response) => {
					console.log(response);
					vm.getCart()
					vm.isLoading = false
				})
			},
			addCouponCode(){
				const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMEPATH}/coupon`
				const vm = this
				const coupon = {
					code : vm.coupon_code
				}
				vm.isLoading = true
				this.$http.post(api,{data:coupon}).then((response) => {
					console.log(response);
					// vm.getCart()
					vm.isLoading = false
				})
			}
		},

	}
</script>

<style lang="scss" scoped>
.center{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.field_block{
	width: 70%;
	margin:auto;
	// background: orange;
	&::before,&::after{
		content: '';
		display: block;
		width: 100%;
		border-bottom: 1px solid rgba(0,0,0,0.2);
	}
	&_name{
		padding: 2% 0%;
		text-align: center;
		font-size: 16px;
	}
}
.cartList_block{
	width: 70%;
	margin:auto;
	&_box{
		padding: 2% 0%;
		text-align: center;
		font-size: 16px;
		&::after{
			content: '';
			display: block;
			width: 100%;
			border-bottom: 1px solid rgba(0,0,0,0.2);
			padding-top: 10px;
		}
		&_product{
			position: relative;
			&_trash{
				cursor: pointer;
				position: absolute;
				border-radius: 5px;
				display: inline-block;
				padding: 0px 5px;
				border: 1px solid red;
				left: 0;
				.fa-trash-alt{
					color: red;
				}
			}
			&_trash:hover{
				background-color:red; 
				.fa-trash-alt{
					color: white;
				}
			}
			&_title{
				display: inline-block;
			}
		}

	}
	&_sumAmount,&_disscount{
		&_field{
			display: inline-block;
			text-align: right;
		}
		&_price{
			display: inline-block;
			text-align: center;
		}
		&::after{
			content: '';
			display: block;
			width: 100%;
			border-bottom: 1px solid rgba(0,0,0,0.2);
		}
	}
	&_disscount{
		color:green;
	}
	&_promoCode{
		width: 100%;
		padding: 2% 0%;
		&_input{
			width: 80%;
		}
		&_useButton{
			width: 20%;
		}
	}
	&_email{
		padding: 1% 0%;
		&_input{
			width: 100%;
		}
	}
}
</style>