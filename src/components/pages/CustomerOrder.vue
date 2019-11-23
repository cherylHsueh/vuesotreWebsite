<template>
	<div>
		<loading :active.sync="isLoading" ></loading>
		<div class="row mt-4">
			<div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
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
						<button type="button" class="btn btn-outline-danger btn-sm ml-auto">
							<i class="fas fa-spinner fa-spin" v-if="states.loadingItem === item.id"></i>
							加到購物車
						</button>
					</div>
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
							<option value="1">選購1件</option>
						</select>
						<div class="modal-footer">
							<div class="text-muted text-nowrap mr-3">
								小計<strong>{{product.num * product.price}}</strong>元
							</div>
						</div>
						<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">加入購物車</button>
					</div>
					<!-- <div class="modal-footer">
						<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
						<button type="button" class="btn btn-primary">確認</button>
					</div> -->
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
				states:{
					loadingItem:''
				},
				isLoading:false
			}
		},
		created() {
			this.getProducts()
		},
		methods: {
			getProducts(page =  1){
				const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMEPATH}/products?page=${page}`
				const vm = this
				vm.isLoading = true
				this.$http.get(api).then((response) => {
					vm.isLoading = false
					vm.products = response.data.products
					console.log(vm.products);
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
			}			
		},

	}
</script>

<style lang="scss" scoped>

</style>