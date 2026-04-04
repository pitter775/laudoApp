export const storageService = {
  convertToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(new Error("Não foi possível converter o arquivo para base64."));
          return;
        }

        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(new Error("Erro ao ler o arquivo selecionado."));
      };

      reader.readAsDataURL(file);
    });
  },
  async convertFilesToBase64(files: File[]) {
    return Promise.all(
      files.map(async (file) => ({
        id: `${file.name}-${file.lastModified}`,
        nome: file.name,
        imagemBase64: await this.convertToBase64(file),
      })),
    );
  },
};
