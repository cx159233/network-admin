<script>
import { codeLogin } from "@/api/login";
export default {
  name: "auth",
  data() {
    return {};
  },
  render: function (h) {
    return h("<div>正在鉴权，请稍后...</div>"); // avoid warning message
  },
  created() {
    codeLogin()
      .then((res) => {
        const { code } = res;
        if (code != 200) {
          this.$router.replace("/401");
        } else {
          this.$router.replace({ path: "/" });
        }
      })
      .catch((err) => {
        this.$router.replace("/401");
      });
  },
};
</script>
