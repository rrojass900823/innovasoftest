export interface ClienteFormData {
    identificacion: string;
    nombre: string;
    apellidos: string;
    sexo: string;
    fNacimiento: string;
    fAfiliacion: string;
    telefonoCelular: string;
    otroTelefono: string;
    interesFK: string | number;
    direccion: string;
    resenaPersonal: string;
    imagen: string;
    interesesId?: string | number;
}