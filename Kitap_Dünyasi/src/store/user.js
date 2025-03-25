export default {
  namespaced: true,
  state: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async register({ commit }, userData) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        let users = [];
        const usersData = localStorage.getItem("registeredUser");
        if (usersData) {
          users = JSON.parse(usersData);
          if (!Array.isArray(users)) {
            users = [users];
          }
        }

        if (users.some((user) => user.email === userData.email)) {
          throw new Error("Bu e-posta adresi zaten kullanımda!");
        }

        const newUser = {
          id: Date.now(),
          email: userData.email,
          password: userData.password,
          name: userData.name || `Kullanıcı ${users.length + 1}`,
        };

        users.push(newUser);
        localStorage.setItem("registeredUser", JSON.stringify(users));

        const { password, ...userWithoutPassword } = newUser;
        const response = {
          user: userWithoutPassword,
          token: `token-${newUser.id}-${Date.now()}`,
        };

        commit("SET_USER", response.user);
        commit("SET_TOKEN", response.token);

        return response;
      } catch (error) {
        commit(
          "SET_ERROR",
          error.message || "Kayıt işlemi sırasında bir hata oluştu"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async login({ commit }, credentials) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        let users = [];
        const usersData = localStorage.getItem("registeredUser");
        if (usersData) {
          const parsedData = JSON.parse(usersData);
          users = Array.isArray(parsedData) ? parsedData : [parsedData];
        }

        const user = users.find(
          (u) =>
            u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          const { password, ...userWithoutPassword } = user;
          const response = {
            user: userWithoutPassword,
            token: `token-${user.id}-${Date.now()}`,
          };

          commit("SET_USER", response.user);
          commit("SET_TOKEN", response.token);

          if (credentials.remember) {
            localStorage.setItem("remember_email", credentials.email);
          } else {
            localStorage.removeItem("remember_email");
          }

          return response;
        } else {
          throw new Error("E-posta veya şifre hatalı!");
        }
      } catch (error) {
        commit(
          "SET_ERROR",
          error.message || "Giriş işlemi sırasında bir hata oluştu"
        );
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
    logout({ commit }) {
      commit("SET_USER", null);
      commit("SET_TOKEN", null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    initAuth({ commit }) {
      const token = localStorage.getItem("token");
      if (token) {
        commit("SET_TOKEN", token);

        const tokenParts = token.split("-");
        if (tokenParts.length > 1) {
          const userId = parseInt(tokenParts[1]);

          const usersData = localStorage.getItem("registeredUser");
          if (usersData) {
            const parsedData = JSON.parse(usersData);
            const users = Array.isArray(parsedData) ? parsedData : [parsedData];
            const user = users.find((u) => u.id === userId);

            if (user) {
              const { password, ...userWithoutPassword } = user;
              commit("SET_USER", userWithoutPassword);
            }
          }
        }
      }

      return {
        rememberedEmail: localStorage.getItem("remember_email") || "",
      };
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isLoading: (state) => state.loading,
    getUser: (state) => state.user,
    getError: (state) => state.error,
  },
};
