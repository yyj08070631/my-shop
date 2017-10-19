<template>
	<div>
		<nav-header></nav-header>
		<nav-bread>
			<span slot="bread">Goods</span>
		</nav-bread>
		<div class="accessory-result-page accessory-page">
			<div class="container">
				<div class="filter-nav">
					<span class="sortby">Sort by:</span>
					<a href="javascript:void(0)" class="default cur">Default</a>
					<a href="javascript:void(0)" class="price" @click="sortGoods">Price
						<svg class="icon icon-arrow-short">
							<use xlink:href="#icon-arrow-short"></use>
						</svg>
					</a>
					<a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
				</div>
				<div class="accessory-result">
					<!-- filter -->
					<div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
						<dl class="filter-price">
							<dt>Price:</dt>
							<dd>
								<a href="javascript:void(0)" @click="setPriceFilter('all')" :class="{'cur': priceChecked == 'all'}">All</a>
							</dd>
							<dd v-for="(val, key) in priceFilter">
								<a href="javascript:void(0)" @click="setPriceFilter(key)" :class="{'cur': priceChecked == key}">{{val.startPrice}} - {{val.endPrice}}</a>
							</dd>
						</dl>
					</div>

					<!-- search result accessories list -->
					<div class="accessory-list-wrap">
						<div class="accessory-list col-4">
							<ul>
								<li v-for="(val, key) in goodsList">
									<div class="pic">
										<a href="#"><img v-lazy="'../../static/' + val.productImage" alt=""></a>
									</div>
									<div class="main">
										<div class="name">{{val.productName}}</div>
										<div class="price">{{val.salePrice}}</div>
										<div class="btn-area">
											<a href="javascript:;" class="btn btn--m" @click="addCart(val.productId)">加入购物车</a>
										</div>
									</div>
								</li>
							</ul>
							<!-- 滚动加载 -->
							<div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
								<img src="../assets/imgs/loading-spinning-bubbles.svg" alt="" v-show="loading">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 遮罩 -->
		<div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
		<nav-footer></nav-footer>
	</div>
</template>
<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import NavHeader from '../components/NavHeader'
import NavFooter from '../components/NavFooter'
import NavBread from '../components/NavBread'
import axios from 'axios'
export default {
	components: {
		NavHeader,
		NavFooter,
		NavBread
	},
	data() {
		return {
			// 接口获取的商品列表
			goodsList: [],
			// 价格过滤器
			priceFilter: [
				{
					startPrice: '0.00',
					endPrice: '100.00'
				},
				{
					startPrice: '100.00',
					endPrice: '500.00'
				},
				{
					startPrice: '500.00',
					endPrice: '1000.00'
				},
				{
					startPrice: '1000.00',
					endPrice: '5000.00'
				}
			],
			// 判断价格过滤器是否被选中
			priceChecked: 'all',
			// 小屏过滤器是否弹出
			filterBy: false,
			// 过滤器遮罩是否弹出
			overLayFlag: false,
			// 排序的页码page, 每页条数pageSize, 排序顺序true升序false降序, 滚动加载函数是否可用busy, 加载图标显示loading
			page: 1,
			pageSize: 8,
			sortFlag: true,
			busy: true,
			loading: false
		}
	},
	mounted: function() {
		this.getGoodsList();
	},
	methods: {
		// 获取商品列表
		getGoodsList(flag) {
			let params = {
				page: this.page,
				pageSize: this.pageSize,
				sort: this.sortFlag ? 1 : -1,
				priceLevel: this.priceChecked
			};
			this.loading = true;
			axios({
				method: 'GET',
				url: '/goods',
				params: params
			}).then((result) => {
				let res = result.data;
				console.log(res);
				if (res.status == '0') {
					if (flag) {
						this.goodsList = this.goodsList.concat(res.result.list);

						if (res.result.count < 8) {
							this.busy = true;
							this.loading = false;
						} else {
							this.busy = false;
						}
					} else {
						this.goodsList = res.result.list;
						this.busy = false;
					}
				} else {
					this.goodsList = [];
				}
			});
		},
		// 对价格进行排序
		sortGoods() {
			this.sortFlag = !this.sortFlag;
			this.page = 1;
			this.getGoodsList();
		},
		// 价格过滤器
		setPriceFilter(index) {
			this.priceChecked = index;
			this.page = 1;
			this.getGoodsList();
			this.closePop();
		},
		// 下拉加载
		loadMore() {
			this.busy = true;

			setTimeout(() => {
				this.page++;
				this.getGoodsList(true);
			}, 1000);
		},
		// 添加购物车
		addCart(productId) {
			axios({
				method: 'POST',
				url: '/goods/addCart',
				data: {
					productId: productId
				}
			}).then((res) => {
				if (res.status == 0) {
					alert('加入成功');
				} else{
					alert(`msg: ${res.msg}`);
				}
			});
		},
		// 小屏时展开价格过滤器
		showFilterPop() {
			this.filterBy = true;
			this.overLayFlag = true;
		},
		// 关闭遮罩
		closePop() {
			this.filterBy = false;
			this.overLayFlag = false;
		}
	}
}
</script>
<style lang="less">
.load-more {
	height: 100px;
	line-height: 100px;
	text-align: center;
}
</style>
