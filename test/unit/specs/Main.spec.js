import Vue from 'vue';
import Main from '@/components/Main';

describe('Main.vue', () => {
  it('should show the logo', () => {
    const Constructor = Vue.extend(Main);
    const vm = new Constructor().$mount();

    // eslint-disable-next-line
    expect(vm.$el.querySelector('.c-header__logo'))
      .to.have.property('src').that.is.not.empty;
  });

  it('should show the map', () => {
    const Constructor = Vue.extend(Main);
    const vm = new Constructor().$mount();

    // eslint-disable-next-line
    expect(vm.$el.querySelector('.c-map'))
      .to.not.be.empty;
  });
});
