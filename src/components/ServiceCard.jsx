
const ServiceCard = ({service, onApply, cardRef = null}) => {
  return (
      <div  ref={cardRef} className=" bg-white dark:bg-zinc-800 border border-dashed border-blue-800/80 p-4 rounded shadow h-full flex flex-col justify-between">
          <h3 className="text-[1em] font-semibold mb-2">{service.title}</h3>
          <p className=" text-[0.9em]">{service.description}</p>
          <button onClick={() => onApply(service.id)} className=" mt-2 bg-blue-100 text-blue-800/80 font-medium self-end px-4 py-2 rounded-md hover:bg-blue-200 cursor-pointer">Apply</button>
      </div>
  )
}

export default ServiceCard