<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{ seller.name }}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{ seller.ratingCount }})</span>
          <span class="text">月售{{ seller.sellCount }}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{ seller.minPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{ seller.minPrice }}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active': favorite }"></span>
          <span class="text">{{ favoriteText }}</span>
        </div>
      </div>

      <split></split>

      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{ seller.bulletin }}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="(item, index) in seller.supports" :key="index">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{ seller.supports[index].description }}</span>
          </li>
        </ul>
      </div>

      <split></split>

      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic, index) in seller.pics" :key="index">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>

      <split></split>

      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item" v-for="(info, index) in seller.infos" :key="index">{{ info }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import { saveToLocal, loadFromLocal } from 'common/js/store.js';
import star from 'components/star/star';
import split from 'components/split/split';

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite');
      })()
    };
  },
  computed: {
    favoriteText() {
      return this.favorite ? '已收藏' : '收藏';
    }
  },
  created() {  // created不能保证DOM已经渲染,better-scroll严格需要DOM已经被渲染
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  mounted() {  // el被新创建的vm.$el替换，并挂在到实例上去之后调用该钩子函数。
    // console.log(this.seller);  // 空对象,因为seller是异步获取的，这里DOM的渲染要依赖seller的数据，所以一开始数据还没返回
    this._initScroll();
    this._initPics();
  },
  // mounted执行优先于watch
  watch: {  // 切换tab时，这个方法不会执行，因为页面一开始seller返回数据就改变了，切换时seller不会改变
    seller() {
      this._initScroll();
      this._initPics();
    }
  },
  methods: {
    _initScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    _initPics() {
      if (this.seller.pics) {  // 内层ul的宽度要超过外层宽度才会滚动
        let picWidth = 120;
        let margin = 6;
        let width = (picWidth + margin) * this.seller.pics.length - margin;
        this.$refs.picList.style.width = width + 'px';
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,   // better-scroll横向滚动属性
              eventPassthrough: 'vertical'  // 垂直方向不滚动
            });
          } else {
            this.picScroll.refresh();
          }
        });
      }
    },
    toggleFavorite(event) {
      if (!event._constructed) {
        return;
      }
      this.favorite = !this.favorite;
      saveToLocal(this.seller.id, 'favorite', this.favorite);
    }
  },
  components: {
    star,
    split
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import "../../common/scss/mixin.scss";

.seller {
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;

  .overview {
    position: relative;
    padding: 18px;

    .title {
      margin-bottom: 8px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .desc {
      padding-bottom: 18px;
      @include border-1px(rgba(7, 17, 27, 0.1));
      font-size: 0;

      .star {
        display: inline-block;
        vertical-align: top;
        margin-right: 8px;
      }

      .text {
        display: inline-block;
        margin-right: 12px;
        line-height: 18px;
        vertical-align: top;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }

    .remark {
      display: flex;
      padding-top: 18px;

      .block {
        flex: 1;
        text-align: center;
        border-right: 1px solid rgba(7, 17, 27, 0.1);

        &:last-child {
          border-right: 0;
        }

        h2 {
          margin-bottom: 4px;
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .content {
          line-height: 24px;
          font-size: 10px;
          color: rgb(7, 17, 27);

          .stress {
            font-size: 24px;
          }
        }
      }
    }

    .favorite {
      position: absolute;
      width: 50px;
      right: 11px;
      top: 18px;
      text-align: center;

      .icon-favorite {
        display: block;
        margin-bottom: 4px;
        line-height: 24px;
        font-size: 24px;
        color: #d4d6d9;

        &.active {
          color: rgb(240, 20, 20);
        }
      }

      .text {
        line-height: 10px;
        font-size: 10px;
      }
    }
  }

  .bulletin {
    padding: 18px 18px 0 18px;

    .title {
      margin-bottom: 8px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .content-wrapper {
      padding: 0 12px 16px 12px;
      @include border-1px(rgba(7, 17, 27, 0.1));

      .content {
        line-height: 24px;
        font-size: 12px;
        color: rgb(240, 20, 20);
      }
    }

    .supports {
      .support-item {
        padding: 16px 12px;
        @include border-1px(rgba(7, 17, 27, 0.1));
        font-size: 0;

        &:last-child {
          @include border-none();
        }

        .icon {
          display: inline-block;
          vertical-align: top;
          width: 16px;
          height: 16px;
          margin-right: 6px;
          background-size: 16px 16px;
          background-repeat: no-repeat;

          &.decrease {
            @include bg-image('decrease_4');
          }

          &.discount {
            @include bg-image('discount_4');
          }

          &.guarantee {
            @include bg-image('guarantee_4');
          }

          &.invoice {
            @include bg-image('invoice_4');
          }

          &.special {
            @include bg-image('special_4');
          }
        }
        .text {
          line-height: 16px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }
      }
    }
  }

  .pics {
    padding: 18px;

    .title {
      margin-bottom: 12px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .pic-wrapper {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;

      .pic-list {
        font-size: 0;
        .pic-item {
          display: inline-block;
          margin-right: 6px;
          width: 120px;
          height: 90px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }

  .info {
    padding: 18px 18px 0 18px;
    color: rgb(7, 17, 27);

    .title {
      padding-bottom: 12px;
      line-height: 14px;
      @include border-1px(rgba(7, 17, 27, 0.1));
      font-size: 14px;
    }

    .info-item {
      padding: 16px 12px;
      line-height: 16px;
      @include border-1px(rgba(7, 17, 27, 0.1));
      font-size: 12px;
      &:last-child {
        @include border-none();
      }
    }
  }
}
</style>
