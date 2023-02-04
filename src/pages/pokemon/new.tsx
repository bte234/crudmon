import { type SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Pokemon, pokemonSchema } from "../../schema/pokemon"
import { api } from "../../utils/api"
import { useRouter } from "next/router"
import Link from "next/link"
import TextInput from "../../components/text-input"

const AddPokemon = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Pokemon>({
        resolver: zodResolver(pokemonSchema),
    })

    const router = useRouter()

    const { data: abilities } = api.abilities.list.useQuery()

    const mutation = api.pokemon.create.useMutation({
        onSuccess: () => router.push("/"),
    })

    const onSubmit: SubmitHandler<Pokemon> = (data) => {
        console.log("submitting", data)
        return mutation.mutate(data)
    }

    return (
        <>
            <main className="container mx-auto mt-16 text-slate-700">
                <Link href="/">Back</Link>
                <h1 className="mb-16 text-center text-4xl">Add Pokemon</h1>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <TextInput
                        label="Name"
                        {...register("name")}
                        required
                        errorMessage={errors?.name?.message}
                    />

                    <div>
                        <label htmlFor="ability-1">Ability 1</label>
                        <select
                            id="ability-1"
                            {...register("abilityOneId")}
                            defaultValue={abilities?.[0]?.id}
                        >
                            {abilities?.map((ability) => (
                                <option key={ability.id} value={ability.id}>
                                    {ability.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="ability-2">Ability 2</label>
                        <select
                            id="ability-2"
                            {...register("abilityTwoId", {
                                setValueAs: (v: string) => {
                                    return v === "" ? undefined : v
                                },
                            })}
                            defaultValue=""
                        >
                            <option value="">none</option>
                            {abilities?.map((ability) => (
                                <option key={ability.id} value={ability.id}>
                                    {ability.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="hidden-ability">Hidden Ability</label>
                        <select
                            id="hidden-ability"
                            {...register("hiddenAbilityId")}
                            defaultValue={undefined}
                        >
                            <option value={undefined}>None</option>
                            {abilities?.map((ability) => (
                                <option key={ability.id} value={ability.id}>
                                    {ability.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <TextInput
                        label="Type 1"
                        {...register("typeOne")}
                        required
                        errorMessage={errors?.typeOne?.message}
                    />
                    <TextInput
                        label="Type 2"
                        {...register("typeTwo")}
                        errorMessage={errors?.typeTwo?.message}
                    />
                    <button
                        type="submit"
                        className="self-center rounded bg-blue-600 py-2 px-4 text-white hover:bg-blue-800"
                    >
                        Submit
                    </button>
                </form>
            </main>
        </>
    )
}

export default AddPokemon
