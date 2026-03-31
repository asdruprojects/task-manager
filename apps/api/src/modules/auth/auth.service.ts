import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { JwtPayload } from './strategies/jwt.strategy';

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con este correo');
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user = await this.usersService.create({
      name: dto.name,
      lastName: dto.lastName,
      email: dto.email.toLowerCase().trim(),
      password: hashedPassword,
    });

    return {
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(
      dto.email.toLowerCase().trim(),
    );

    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.generateToken(
      user.id,
      user.email,
      user.name,
      user.lastName,
    );

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
      },
    };
  }

  private generateToken(
    id: number,
    email: string,
    name: string,
    lastName: string,
  ): string {
    const payload: JwtPayload = { sub: id, email, name, lastName };
    return this.jwtService.sign(payload);
  }
}
