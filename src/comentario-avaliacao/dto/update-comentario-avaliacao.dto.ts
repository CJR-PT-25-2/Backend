import { PartialType } from "@nestjs/mapped-types";
import { CreateComentarioAvaliacaoDto } from "./create-comentario-avaliacao.dto";

export class UpdateComentarioAvaliacaoDto extends PartialType (CreateComentarioAvaliacaoDto) {}