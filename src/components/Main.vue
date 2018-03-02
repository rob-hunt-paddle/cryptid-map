<template>
  <div>
    <header class="c-header">
      <img class="c-header__logo" src="../assets/logo.png" />
      <button
        class="c-btn c-btn--add"
        type="button"
        @click="toggleForm">Add cryptid</button>
    </header>

    <gmap-map
      class="c-map"
      :center="{ lat: 10, lng: 10 }"
      :zoom="2"
      map-type-id="roadmap"
    >
      <gmap-cluster>
        <gmap-marker
          class="c-map__marker"
          v-for="(cryptid, idx) in cryptids" :key="idx"
          :position="getCoordinates(cryptid)"
          :clickable="true"
          @click="toggleInfo(idx, cryptid)">
        </gmap-marker>
      </gmap-cluster>
    </gmap-map>

    <aside class="c-map__info c-map-info" v-bind:class="{ 'is-showing': showInfo }">
      <img class="c-map-info__image" :src="info.image">
      <h1 class="c-map-info__title">{{ info.name }}</h1>
      <p class="c-map-info__description">{{ info.description }}</p>
      <h3 class="c-map-info__subtitle">References:</h3>
      <ul class="c-map-info__list" v-for="(reference, jdx) in info.references" :key="jdx">
        <li class="c-map-info__list-item">
          <a class="c-map-info__list-link"
             :href="reference.url"
             :title="reference.name"
             target="_blank">
            {{ reference.date | formatDate }} - {{ reference.name }}
          </a>
        </li>
      </ul>
    </aside>

    <form class="c-form"
          @submit="addCryptid(name, image, description, lat, lng, references)"
          v-bind:class="{ 'is-showing': showForm }">
      <legend class="c-form__legend">Add a cryptid</legend>
      <input class="c-form__input" v-model="name" placeholder="Cryptid name" required>
      <input
        class="c-form__input"
        type="url" v-model="image"
        placeholder="Cryptid image URL"
        required>
      <textarea
        class="c-form__input c-form__input--textarea"
        v-model="description"
        placeholder="Cryptid description"
        required>
      </textarea>

      <label class="c-form__label">Location co-ordinates</label>
      <input
        class="c-form__input"
        type="number"
        step="any"
        v-model="lat"
        placeholder="Latitude"
        required>
      <input
        class="c-form__input"
        type="number"
        step="any"
        v-model="lng"
        placeholder="Longitude"
        required>

      <label class="c-form__label">References</label>
      <div class="c-form__group" v-for="(reference, idx) in references" :key="idx">
        <input class="c-form__input" v-model="reference.name" placeholder="Reference name">
        <input class="c-form__input" type="url" v-model="reference.url" placeholder="Reference URL">
        <input
          class="c-form__input"
          type="datetime-local"
          v-model="reference.date"
          placeholder="Reference date">
      </div>

      <button class="c-btn c-btn--reference"
              type="button"
              @click="addReference">Add reference</button>
      <div class="c-form__legend c-form__legend--bottom">
        <button class="c-btn c-btn--submit" type="submit">Add new cryptid</button>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import moment from 'moment';
import { db } from '../main';

export default {
  name: 'Main',
  data() {
    return {
      cryptids: [],
      name: '',
      image: '',
      description: '',
      lat: '',
      lng: '',
      references: [{
        name: '',
        url: '',
        date: moment().format(moment.HTML5_FMT.DATETIME_LOCAL),
      }],
      showForm: false,
      showInfo: false,
      infoIndex: null,
      info: {
        name: '',
        image: '',
        description: '',
        references: [],
      },
    };
  },
  firestore() {
    return {
      cryptids: db.collection('cryptids').orderBy('createdAt'),
    };
  },
  methods: {
    addCryptid(name, image, description, lat, lng, references = []) {
      const createdAt = moment().format('MM/DD/YYYY hh:mm:ss');
      const location = new firebase.firestore.GeoPoint(parseFloat(lat), parseFloat(lng));
      const formattedReferences = [];

      for (let i = 0; i < references.length; i += 1) {
        const reference = references[i];

        reference.date = this.saveDateFormat(reference.date);
        formattedReferences.push(reference);
      }

      db.collection('cryptids').add({ name, image, description, location, references: formattedReferences, createdAt });
    },
    addReference() {
      this.references.push({
        name: '',
        url: '',
        date: moment().format(moment.HTML5_FMT.DATETIME_LOCAL),
      });
    },
    getCoordinates(item) {
      return { lat: item.location.latitude, lng: item.location.longitude };
    },
    saveDateFormat(date = null) {
      if (date) {
        return moment(String(date)).format('MM/DD/YYYY hh:mm:ss');
      }

      return moment.now.format('MM/DD/YYYY hh:mm:ss');
    },
    toggleInfo(idx, data) {
      this.showInfo = !this.showInfo;

      console.log(data);
      if (idx !== this.infoIndex) {
        this.showInfo = true;
        this.infoIndex = idx;
        this.info = data;
      }
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$black: #212121;
$dark-blue: #2286c3;
$light-blue: #9be7ff;
$btn-blue: #64B5F6;

a {
  color: $btn-blue;
  text-decoration: none;
  transition: color ease-in-out 0.3s, text-decoration ease-in-out 0.3s;
  will-change: color, text-decoration;

  &:hover, &:focus {
    color: $dark-blue;
    text-decoration: underline;
  }
}
.c-header {
  align-items: center;
  background: $dark-blue;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 10px 0;
  width: 100%;

  &__logo {
    display: block;
    margin: 0 0 0 10px;
    width: 200px;
  }
}
.c-btn {
  background: $btn-blue;
  border: none;
  border-radius: 2px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2),
              0 2px 2px 0 rgba(0, 0, 0, .14),
              0 1px 5px 0 rgba(0, 0, 0, .12);
  color: $black;
  cursor: pointer;
  display: block;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  height: 36px;
  min-width: 88px;
  text-align: center;
  text-transform: uppercase;
  transition: box-shadow .28s cubic-bezier(.4, 0, .2, 1);
  will-change: box-shadow;

  &:active {
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2),
                0 8px 10px 1px rgba(0, 0, 0, .14),
                0 3px 14px 2px rgba(0, 0, 0, .12);
    outline: none;
  }
  &:focus {
    outline: none;
  }

  &--add {
    margin-left: 30px;
  }

  &--reference {
    margin: 10%;
  }
}
.c-map {
  height: calc(100vh - 61px);
  width: 100vw;
}
.c-map-info {
  background: #FFF;
  box-sizing: border-box;
  display: block;
  height: calc(100vh - 61px);
  position: absolute;
  right: -35vw;
  top: 61px;
  transition: right ease-in-out 0.7s;
  width: 35vw;
  will-change: right;

  &.is-showing {
    right: 0;
  }
  &__image {
    background: $light-blue;
    display: block;
    height: 25%;
    margin: 0 auto;
    object-fit: cover;
    padding: 10%;
    width: 80%;
  }
  &__title {
    background: $dark-blue;
    font-size: 20px;
    font-weight: 500;
    margin: 0 0 30px;
    padding: 15px 10%;
  }
  &__subtitle {
    margin: 15px 10%;
  }
  &__description, &__list {
    font-size: 16px;
    margin: 10px 10%;
  }
  &__description {
    margin-bottom: 30px;
  }
  &__list {
    list-style-position: inside;
    padding: 0;
  }
  &__list-link {
    word-wrap: break-word;
  }
}
.c-form {
  background: #FFF;
  box-sizing: border-box;
  display: block;
  height: calc(100vh - 61px);
  position: absolute;
  left: -35vw;
  top: 61px;
  transition: left ease-in-out 0.7s;
  width: 35vw;
  will-change: left;

  &.is-showing {
    left: 0;
  }

  &__legend {
    background: $light-blue;
    box-sizing: border-box;
    display: block;
    font-size: 20px;
    margin: 0 auto;
    padding: 10%;
    width: 100%;

    &--bottom {
      background: $dark-blue;
    }
  }

  &__label {
    box-sizing: border-box;
    color: $btn-blue;
    display: block;
    font-size: 16px;
    margin: 10%;
    width: 78%;
  }

  &__input {
    background: none;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, .12);
    box-sizing: border-box;
    display: block;
    font-size: 16px;
    margin: 10%;
    padding: 0 0 8px;
    transition: border-bottom-color .18s cubic-bezier(.4, 0, .2, 1);
    width: 78%;
    will-change: border-bottom-color;

    &:focus {
      border-bottom-color: $btn-blue;
      outline: none;
    }
  }
  &__input + &__label {
    margin-top: 24px;
  }
}
</style>
