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
					<a href="javascript:void(0)" class="price">Price
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
										<a href="#"><img v-lazy="'../../static/' + val.prodcutImg" alt=""></a>
									</div>
									<div class="main">
										<div class="name">{{val.productName}}</div>
										<div class="price">{{val.prodcutPrice}}</div>
										<div class="btn-area">
											<a href="javascript:;" class="btn btn--m">加入购物车</a>
										</div>
									</div>
								</li>
							</ul>
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
					endPrice: '500.00'
				},
				{
					startPrice: '500.00',
					endPrice: '1000.00'
				},
				{
					startPrice: '1000.00',
					endPrice: '2000.00'
				}
			],
			// 判断价格过滤器是否被选中
			priceChecked: 'all',
			// 小屏过滤器是否弹出
			filterBy: false,
			// 过滤器遮罩是否弹出
			overLayFlag: false
		}
	},
	mounted: function(){
		this.getGoodsList();
	},
	methods: {
		// 获取商品列表
		getGoodsList() {
			axios({
				method: 'GET',
				url: '/goods',
			}).then((result)=>{
				let res = result.data;
				console.log(res);
				this.goodsList = res.result;
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
		},
		// 小屏时点击切换价格过滤器的效果
		setPriceFilter(key) {
			this.priceChecked = key;
			this.closePop();
		}
	}
}
</script>
