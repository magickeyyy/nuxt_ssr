<template>
  <div class="home_no">
    <section class="view advantage level">
      <h3 class="lg_title">{{$t('home.advantages.title')}}</h3>
      <div class="container">
        <div class="box">
          <ul>
            <li>
              <div>20000+</div>
              <p v-html="$t('home.advantages.items[0]')"></p>
            </li>
            <li>
              <div>5000+</div>
              <p v-html="$t('home.advantages.items[1]')"></p>
            </li>
          </ul>
          <ul>
            <li>
              <div>600+</div>
              <p v-html="$t('home.advantages.items[2]')"></p>
            </li>
            <li>
              <div>3000+</div>
              <p v-html="$t('home.advantages.items[3]')"></p>
            </li>
          </ul>
          <div class="center">
            <div class="core">
              <img src="~assets/icon/icon_cup.png" alt />
              <div v-html="$t('home.advantages.core[0]')"></div>
              <p v-html="$t('home.advantages.core[1]')"></p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="view details">
      <h3 class="lg_title" v-html="$t('home.Details.title')"></h3>
      <ul class="container">
        <li>
          <div>
            <img src="~assets/public_img/img_home_adva1.png" />
          </div>
          <h3 v-html="$t('home.Details.items[0].title')"></h3>
          <p v-html="$t('home.Details.items[0].desc')"></p>
        </li>
        <li>
          <div>
            <img src="~assets/public_img/img_home_adva2.png" />
          </div>
          <h3 v-html="$t('home.Details.items[1].title')"></h3>
          <p v-html="$t('home.Details.items[1].desc')"></p>
        </li>
        <li>
          <div>
            <img src="~assets/public_img/img_home_adva3.png" />
          </div>
          <h3 v-html="$t('home.Details.items[2].title')"></h3>
          <p v-html="$t('home.Details.items[2].desc')"></p>
        </li>
        <li>
          <div>
            <img src="~assets/public_img/img_home_adva4.png" />
          </div>
          <h3 v-html="$t('home.Details.items[3].title')"></h3>
          <p v-html="$t('home.Details.items[3].desc')"></p>
        </li>
        <li>
          <div>
            <img src="~assets/public_img/img_home_adva5.png" />
          </div>
          <h3 v-html="$t('home.Details.items[4].title')"></h3>
          <p v-html="$t('home.Details.items[4].desc')"></p>
        </li>
        <li>
          <div>
            <img src="~assets/public_img/img_home_adva6.png" />
          </div>
          <h3 v-html="$t('home.Details.items[5].title')"></h3>
          <p v-html="$t('home.Details.items[5].desc')"></p>
        </li>
      </ul>
    </section>
    <section class="view client">
      <h3 class="lg_title" v-html="$t('home.clients.title')"></h3>
      <ul>
        <li>
          <img src="~assets/public_img/img_home_client1.png" />
          <p v-html="$t('home.clients.items[0]')"></p>
        </li>
        <li>
          <img src="~assets/public_img/img_home_client2.png" />
          <p v-html="$t('home.clients.items[1]')"></p>
        </li>
        <li>
          <img src="~assets/public_img/img_home_client3.png" />
          <p v-html="$t('home.clients.items[2]')"></p>
        </li>
      </ul>
    </section>
    <section class="view partner level">
      <h3 class="lg_title" v-html="$t('home.partner')"></h3>
      <ul>
        <li>
          <img src="~assets/public_img/img_home_partner1.png" alt />
        </li>
        <li>
          <img src="~assets/public_img/img_home_partner2.png" alt />
        </li>
        <li>
          <img src="~assets/public_img/img_home_partner3.png" alt />
        </li>
        <li>
          <img src="~assets/public_img/img_home_partner4.png" alt />
        </li>
      </ul>
      <ul>
        <li>
          <img src="~assets/public_img/img_home_partner5.png" alt />
        </li>
        <li>
          <img src="~assets/public_img/img_home_partner6.png" alt />
        </li>
        <li>
          <img src="~assets/public_img/img_home_partner7.png" alt />
        </li>
        <li>
          <img src="~assets/public_img/img_home_partner8.png" alt />
        </li>
      </ul>
    </section>
    <section class="view about level">
      <div class="box">
        <h3 class="lg_title" v-html="$t('home.aboutUs.title')"></h3>
        <p v-html="$t('home.aboutUs.desc[0]')"></p>
        <p v-html="$t('home.aboutUs.desc[1]')"></p>
        <p v-html="$t('home.aboutUs.desc[2]')"></p>
        <div>
          <div>
            <h3>{{$t('home.aboutUs.cultures.title')}}</h3>
            <p>Work hard</p>
            <p>Have fun</p>
            <p>Make history</p>
          </div>
          <div>
            <h3>{{$t('home.aboutUs.values.title')}}</h3>
            <ul>
              <li>
                <div>
                  <img src="~assets/public_img/img_home_about1.png" alt />
                </div>
                <p>{{$t('home.aboutUs.values.items[0]')}}</p>
              </li>
              <li>
                <div>
                  <img src="~assets/public_img/img_home_about2.png" alt />
                </div>
                <p>{{$t('home.aboutUs.values.items[1]')}}</p>
              </li>
              <li>
                <div>
                  <img src="~assets/public_img/img_home_about3.png" alt />
                </div>
                <p>{{$t('home.aboutUs.values.items[2]')}}</p>
              </li>
            </ul>
            <ul>
              <li>
                <div>
                  <img src="~assets/public_img/img_home_about4.png" alt />
                </div>
                <p>{{$t('home.aboutUs.values.items[3]')}}</p>
              </li>
              <li>
                <div>
                  <img src="~assets/public_img/img_home_about5.png" alt />
                </div>
                <p>{{$t('home.aboutUs.values.items[4]')}}</p>
              </li>
              <li>
                <div>
                  <img src="~assets/public_img/img_home_about6.png" alt />
                </div>
                <p>{{$t('home.aboutUs.values.items[5]')}}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="view joinus level">
      <h3 class="lg_title">{{$t('home.joinUs.title')}}</h3>
      <p>{{$t('home.joinUs.desc')}}</p>
      <router-link to="/joinus">{{$t('home.joinUs.link')}}</router-link>
    </section>
    <section class="view contact level">
      <h3 class="lg_title">{{$t('home.contact.title')}}</h3>
      <ul>
        <li></li>
        <li>
          <h3 v-html="$t('home.contact.name')"></h3>
          <address v-html="$t('home.contact.address')"></address>
          <p v-html="$t('home.contact.tell')"></p>
          <p v-html="$t('home.contact.email')"></p>
        </li>
      </ul>
      <ul>
        <li>
          <img src="~assets/icon/icon_tel.png" alt />
          <p v-html="$t('home.contact.bottom[0]')"></p>
        </li>
        <li>
          <img src="~assets/icon/icon_email1.png" alt />
          <p v-html="$t('home.contact.bottom[1]')"></p>
        </li>
        <li class="last">
          <img src="~assets/icon/icon_email2.png" alt />
          <p v-html="$t('home.contact.bottom[2]')"></p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  layout:'home'
};
</script>
<style lang="less" scoped>
@import url("~assets/style/variable.less");
* {
  box-sizing: content-box;
}
.container{
  width: 1200px;
}
// banner
.banner {
  height: 850px;
  background-color: #0e2839;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("../assets/banner/banner1.png");
  color: #f2f2f2;
  text-align: center;
  h1 {
    font-size: 48px;
    line-height: 72px;
    padding: 323px 0 26px;
  }
  h3 {
    font-size: 30px;
    line-height: 36px;
    font-weight: 200;
  }
}
.en {
  .nav_no {
    section {
      > div {
        background-image: url("../assets/public_img/sign_en.png");
      }
    }
  }
  .banner {
    font-family: OswaldMedium;
    h1 {
      padding-top: 274px;
      font-size: 40px;
      letter-spacing: 0px;
      line-height: 50px;
    }
    h3 {
      font-family: HelveticaLight;
      font-weight: 200;
      font-size: 26px;
      color: #f4f4f4;
    }
  }
} 
// 核心优势
.advantage {
  padding-top: 72px;
  .box {
    padding: 85px 76px 123px 180px;
    height: 363px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    ul {
      display: flex;
      justify-content: space-between;
      li {
        background-repeat: no-repeat;
        background-size: 58px;
        padding-left: 70px;
        div {
          font-size: 36px;
          line-height: 1;
        }
        p {
          font-size: 14px;
          line-height: 16px;
          padding: 5px 0;
          color: @999;
        }
      }
      li:last-child {
        width: 254px;
      }
    }
    ul:first-of-type {
      li:first-child {
        background-image: url("~assets/icon/icon_hotel.png");
        div {
          color: #31baff;
        }
      }
      li:last-child {
        background-image: url("~assets/icon/icon_sd.png");
        div {
          color: #e9047b;
        }
      }
    }
    ul:last-of-type {
      li:first-child {
        background-image: url("~assets/icon/icon_bus.png");
        div {
          color: #8660a6;
        }
      }
      li:last-child {
        background-image: url("~assets/icon/icon_plane.png");
        div {
          color: #222;
        }
      }
    }
    .center {
      height: 362px;
      width: 362px;
      position: absolute;
      left: 50%;
      top: 85px;
      margin-left: -181px;
    }
    .core {
      height: 100%;
      width: 100%;
      background-image: url("~assets/public_img/img_home_center.png");
      background-repeat: no-repeat;
      background-size: 362px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 80px;
      position: relative;
      img {
        display: block;
        width: 64px;
        height: 64px;
        margin-bottom: 18px;
      }
      div {
        font-weight: bold;
        color: #222;
        font-size: 16px;
        line-height: 26px;
      }
      .last {
        padding-bottom: 8px;
      }
      p {
        font-size: 14px;
        line-height: 17px;
        color: #999;
        padding-top: 6px;
      }
    }
    .core::before,
    .core::after {
      content: "";
      display: block;
      width: 186px;
      border-bottom: 1px solid @f2;
      position: absolute;
      top: 180px;
    }
    .core::before {
      left: -200px;
    }
    .core::after {
      right: -200px;
    }
  }
}
// 优势详解
.details {
  padding-top: 66px;
  height: 1110px-66;
  background-image: url("~assets/banner/banner2.png");
  .back;
  ul {
    padding-top: 72px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    li {
      width: 308px;
      height: 370px;
      margin-bottom: 73px;
      background-color: #fff;
      border: 1px solid transparent;
      text-align: center;
      div {
        padding-top: 26px;
        img {
          width: 228px;
          height: 150px;
        }
      }
      h3 {
        font-size: 22px;
        line-height: 24px;
        color: #222;
        padding: 20px 0 22px;
      }
      p {
        font-size: 14px;
        line-height: 20px;
        color: #999;
      }
    }
    li:nth-child(3) ~ li {
      height: 380px;
    }
    li:hover {
      border: 1px solid #e2e2e2;
    }
  }
  ul.container {
    width: 1920px - 406 * 2;
  }
}
// 我们的客户
.client {
  padding-top: 66px;
  ul {
    padding-top: 44px;
    display: flex;
    justify-content: center;
    li {
      width: 388px;
      height: 376px;
      text-align: center;
      position: relative;
      text-align: center;
      img {
        width: 206px;
        height: 206px;
      }
      p {
        font-size: 14px;
        line-height: 20px;
        color: #222;
      }
      p:first-of-type {
        padding-top: 20px;
      }
    }
    li::before,
    li::after {
      content: "";
      display: block;
      width: 80px;
      border-bottom: solid 1px #f1f1f1;
      position: absolute;
      top: 102px;
      margin: 0 5px;
    }
    li::before {
      left: 0;
    }
    li::after {
      right: 0;
    }
  }
}
// 我们的合作伙伴
.partner {
  padding-bottom: 54px;
  ul {
    width: 1150px;
    padding-top: 1px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    li {
      border: 1px solid #f4f3f4;
      width: 274px;
      height: 128px;
      text-align: center;
      overflow: hidden;
      img {
        width: 270px;
        height: 124px;
      }
    }
  }
  ul:first-of-type {
    padding: 50px 0 15px;
  }
}
// 关于我们
.about {
  padding-top: 140px;
  height: 924px-140;
  background-image: url("~assets/banner/banner3.png");
  .back;
  .box {
    width: 1200px;
    height: 700px-22;
    padding-top: 22px;
    background-color: rgba(254, 254, 254, 0.9);
    margin: 0 auto;
    > p {
      font-size: 14px;
      color: #666;
      text-align: center;
      line-height: 24px;
      letter-spacing: 0px;
    }
    > p:first-of-type {
      padding-top: 40px;
      line-height: 24px;
    }
    > p:nth-of-type(2) {
      padding-top: 18px;
    }
    > div {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding-top: 75px;
      > div {
        width: 50%;
        box-sizing: border-box;
        h3 {
          font-size: 24px;
          font-weight: bold;
          line-height: 48px;
        }
        h3::after {
          content: "";
          display: block;
          width: 34px;
          height: 3px;
          background-color: #989898;
        }
      }
      > div:first-child {
        padding-left: 158px;
        p {
          color: #e6066f;
          font-size: 26px;
          line-height: 40px;
        }
        p:first-of-type {
          padding-top: 56px;
        }
      }
      > div:last-child {
        padding-left: 40px;
        ul {
          width: 400px;
          display: flex;
          justify-content: space-between;
          li {
            text-align: center;
            height: 110px;
            width: 70px;
            div {
              width: 100%;
              height: 72px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            p {
              font-size: 14px;
              color: #666;
              line-height: 1;
              padding-top: 14px;
              text-align: center;
            }
          }
        }
        ul:first-of-type {
          padding-top: 40px;
        }
        ul:last-of-type {
          padding-top: 26px;
        }
      }
    }
  }
}
// 加入我们
.joinus {
  padding-top: 80px;
  margin: 0 auto;
  background-color: #f7f7f9;
  height: 400px-80;
  p {
    text-align: center;
    color: #7e7e7e;
    font-size: 30px;
    line-height: 90px;
    padding-top: 54px;
  }
  a {
    display: block;
    width: 140px;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    background: #e6066f;
    margin: 0 auto;
  }
}
// 联系我们
.contact {
  padding: 66px 0 54px;
  ul:first-of-type {
    padding: 68px 0 53px;
    display: flex;
    justify-content: center;
    li:first-child {
      background-image: url("~assets/public_img/img_home_map.png");
      background-size: 646px auto;
      width: 646px;
      height: 200px;
    }
    li:last-child {
      padding-left: 80px;
      h3 {
        background: url("~assets/icon/icon_hai.png") no-repeat 0 23px;
        background-size: 30px;
        font-size: 20px;
        font-weight: bold;
        line-height: 24px;
        padding: 23px 0 18px 40px;
      }
      p,
      address {
        color: #999;
      }
      address {
        font-size: 14px;
        line-height: 24px;
      }
      p {
        font-size: 16px;
        line-height: 26px;
      }
    }
  }
  ul:last-of-type {
    width: 1120px;
    height: 173px;
    border-top: 1px solid #e6e5e2;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    li {
      display: flex;
      align-items: center;
      p {
        font-size: 16px;
        color: #424242;
        padding-left: 20px;
      }
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
}
.en {
  .lg_title {
    font-family: OswaldMedium;
  }
  .advantage {
    .box {
      ul {
        li {
          height: 100px;
          div {
            font-family: OswaldMedium;
          }
          p {
            font-family: HelveticaLight;
          }
        }
      }
      .center {
        .core {
          div {
            font-size: 16px;
            line-height: 18px;
            font-weight: bold;
            padding-bottom: 10px;
            font-family: HelveticaNeue;
          }
          p {
            font-size: 14px;
            line-height: 18px;
            font-family: HelveticaLight;
          }
        }
      }
    }
  }
  .details {
    ul {
      li {
        height: 390px;
        margin-bottom: 53px;
        div {
          padding-top: 24px;
        }
        h3 {
          font-family: OswaldMedium;
          font-size: 22px;
          line-height: 24px;
          padding: 22px 0 20px;
        }
        p {
          font-family: HelveticaLight;
          color: #a3a3a3;
        }
      }
      li:nth-child(3) ~ li {
        height: 400px;
      }
      li:nth-child(4) {
        h3 {
          padding-bottom: 50px;
        }
      }
      li:nth-child(5) {
        h3 {
          padding-bottom: 28px;
        }
      }
      li:nth-child(6) {
        h3 {
          padding-bottom: 4px;
        }
      }
    }
  }
  .client {
    ul > li > p {
      color: #262626;
    }
  }
  .about {
    padding-top: 120px;
    .box {
      > p {
        font-family: HelveticaNeue;
        color: #717171;
      }
      > p:first-of-type {
        padding-top: 18px;
        line-height: 18px;
      }
      > p:last-of-type {
        line-height: 18px;
        padding-top: 12px;
      }
      > div {
        > div:last-child {
          ul {
            width: 450px;
            margin-left: -18px;
            li {
              p {
                color: #717171;
              }
            }
            li:first-child {
              width: 98px;
            }
            li:nth-child(2) {
              width: 130px;
            }
            li:last-child {
              width: 130px;
            }
          }
        }
      }
    }
  }
  .join {
    p {
      font-family: OswaldMedium;
      color: #898989;
    }
  }
  .contact {
    ul:first-of-type {
      li:first-child {
        background-image: url("~assets/public_img/img_home_map_en.png");
      }
    }
    > div {
      .box {
        .address {
          > div {
            h3 {
              font-family: OswaldMedium;
            }
          }
          p {
            line-height: 18px;
          }
          p:nth-of-type(2) {
            padding: 10px 0 10px;
          }
        }
      }
      ul > li > h3 {
        font-family: HelveticaNeue;
        color: #4b4b4b;
        line-height: 20px;
      }
    }
  }
}
</style>
