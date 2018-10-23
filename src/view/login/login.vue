<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { getSessionId, login } from '@/api/user'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },

  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit ({ userName, password }) {
      console.log(userName, password)
      const data = {
        loginName: userName,
        password
      }
      getSessionId().then(res => {
        localStorage.setItem('token', res.vo)
        login(data).then(res => {
          this.$router.push({
            name: 'home'
          })
        }).catch(error => {
          console.log(error)
          this.$router.push({
            name: 'home'
          })
        })
      })
      // this.handleLogin({ userName, password }).then(res => {
      //   this.getUserInfo().then(res => {
      //     this.$router.push({
      //       name: 'home'
      //     })
      //   })
      // })
    }
  }
}
</script>

<style>

</style>
