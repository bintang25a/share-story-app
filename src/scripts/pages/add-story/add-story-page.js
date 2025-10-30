import * as ShareStoryAPI from "../../data/api.js";
import AddStoryPresenter from "./add-story-presenter.js";
import Map from "../../utils/map.js";

export default class AddStoryPage {
  #presenter = null;
  #map = null;
  #selectedCoordinate = null;
  #stream = null;
  #selectedMarker = null;

  async render() {
    return `
      <section class="add-story-section container">
        <h1 class="section-title">Tambah Cerita Baru</h1>

        <form id="add-story-form" class="add-story-form">
          <div class="input-container">
            <label for="description-input">Deskripsi Cerita</label>
            <textarea id="description-input" placeholder="Ceritakan pengalaman Anda..." required></textarea>
          </div>

          <div class="input-container">
            <label for="photo-input">Unggah Foto</label>
            <div class="image-container">
              <input type="file" multiple id="photo-input" accept="image/*" capture="environment" required />
              <button id="open-documentations-camera-button" class="btn btn-outline" type="button">
                Buka Kamera
              </button>
            </div>
          </div>

          <div class="input-container">
            <label>Pilih Lokasi di Peta (opsional)</label>
            <div id="map" class="add-story-map" style="height: 300px; border-radius: 12px; overflow: hidden;"></div>
            <p id="coordinate-display" class="coordinate-display">Klik peta untuk memilih lokasi</p>
          </div>

          <div class="button-container">
            <button type="submit" id="submit-button">Kirim Cerita</button>
          </div>
        </form>

        <div id="camera-preview-container" class="camera-preview-container hidden">
          <video id="camera-preview" autoplay></video>
          <button id="close-camera">Tutup Kamera</button>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AddStoryPresenter({
      view: this,
      model: ShareStoryAPI,
    });

    await this.#initializeMap();
    this.#setupForm();
    this.#setupCameraPreview();
  }

  async #initializeMap() {
    this.#map = await Map.build("#map", { zoom: 5, locate: true });

    this.#selectedMarker = null;

    this.#map.addMapEventListener("click", (event) => {
      const { lat, lng } = event.latlng;
      this.#selectedCoordinate = { lat, lng };

      if (this.#selectedMarker) {
        this.#map.map.removeLayer(this.#selectedMarker);
      }

      this.#selectedMarker = this.#map.addMarker([lat, lng]);

      document.getElementById(
        "coordinate-display"
      ).textContent = `Lokasi dipilih: Latitude ${lat.toFixed(
        5
      )}, Longitude ${lng.toFixed(5)}`;
    });
  }

  #setupCameraPreview() {
    const fileInput = document.getElementById(
      "open-documentations-camera-button"
    );
    const previewContainer = document.getElementById(
      "camera-preview-container"
    );
    const video = document.getElementById("camera-preview");
    const closeButton = document.getElementById("close-camera");

    const captureButton = document.createElement("button");
    captureButton.textContent = "Ambil Foto";
    captureButton.type = "button";
    previewContainer.appendChild(captureButton);

    fileInput.addEventListener("click", async () => {
      try {
        this.#stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        video.srcObject = this.#stream;
        previewContainer.classList.remove("hidden");
      } catch (err) {
        console.warn("Tidak dapat mengakses kamera:", err);
      }
    });

    captureButton.addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], "captured-photo.jpg", {
          type: "image/jpeg",
        });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        document.getElementById("photo-input").files = dataTransfer.files;

        alert("Foto berhasil diambil!");
        this.#stopMediaStream();
        previewContainer.classList.add("hidden");
      }, "image/jpeg");
    });

    closeButton.addEventListener("click", () => {
      this.#stopMediaStream();
      previewContainer.classList.add("hidden");
    });
  }

  #stopMediaStream() {
    if (this.#stream) {
      this.#stream.getTracks().forEach((track) => track.stop());
      this.#stream = null;
    }
  }

  #setupForm() {
    document
      .getElementById("add-story-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const description = document
          .getElementById("description-input")
          .value.trim();
        const photo = document.getElementById("photo-input").files[0];

        if (!description || !photo) {
          alert("Deskripsi dan foto wajib diisi!");
          return;
        }

        const formData = new FormData();
        formData.append("description", description);
        formData.append("photo", photo);

        if (this.#selectedCoordinate) {
          formData.append("lat", this.#selectedCoordinate.lat);
          formData.append("lon", this.#selectedCoordinate.lng);
        }

        await this.#presenter.sendStoryData(formData);
      });
  }

  addStorySuccessfully(message) {
    alert(message || "Cerita berhasil ditambahkan!");
    this.#stopMediaStream();
    location.hash = "/";
  }

  addStoryFailed(message) {
    alert(message || "Gagal menambahkan cerita.");
  }
}
