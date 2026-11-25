<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Professional;
use App\Models\Profile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

// COMANDO: php artisan db:seed
class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $professionals = [
            ['nome' => 'Dra. Ana Beatriz Souza', 'nome_perfil' => 'Ana Beatriz Souza', 'email' => 'ana.souza@wings.demo', 'crp_regiao' => 'SP', 'crp_num' => '06123456'],
            ['nome' => 'Dr. Rafael Mendes', 'nome_perfil' => 'Rafael Mendes', 'email' => 'rafael.mendes@wings.demo', 'crp_regiao' => 'RJ', 'crp_num' => '05123457'],
            ['nome' => 'Dra. Camila Ferreira', 'nome_perfil' => 'Camila Ferreira', 'email' => 'camila.ferreira@wings.demo', 'crp_regiao' => 'MG', 'crp_num' => '04123458'],
        ];

        foreach ($professionals as $item) {
            $user = User::updateOrCreate(
                ['email' => $item['email']],
                [
                    'nome' => $item['nome'],
                    'senha' => 'wings-demo-2026',
                    'e_admin' => false,
                    'e_profissional' => true,
                    'status_usuario' => 'ativo',
                    'num_denuncias_usuario' => 0,
                    'data_nasc' => '1988-05-12',
                ]
            );

            Profile::updateOrCreate(
                ['id_usuario' => $user->id_usuario],
                [
                    'nome_perfil' => $item['nome_perfil'],
                    'bio_perfil' => 'Psicologia e acolhimento em cada etapa da sua jornada.',
                    'status_perfil' => 'ativo',
                ]
            );

            Professional::updateOrCreate(
                ['id_usuario' => $user->id_usuario],
                [
                    'crp_regiao' => $item['crp_regiao'],
                    'crp_num' => $item['crp_num'],
                    'cip' => 'professionals/demo-cip.pdf',
                    'regu_crp' => 'professionals/demo-crp.pdf',
                    'e_psi' => null,
                    'registro_status' => 'ativo',
                    'data_expira_certificado' => now()->addYear()->toDateString(),
                    'e_psi_autorizacao' => false,
                ]
            );
        }
    }
}
